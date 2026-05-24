import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { PKG_CREDITS, DEFAULT_ANALYSIS_DATA } from '../common/constants';
import { InitUploadDto } from './upload.dto';

function sanitizeFilename(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.{2,}/g, '_')
    .slice(0, 200);
}

@Injectable()
export class UploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async init(dto: InitUploadDto, userId: string) {
    const credits = PKG_CREDITS[dto.pkg] ?? 1;
    const user = await this.prisma.db.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.credits < credits) throw new BadRequestException('Kredit tidak cukup');

    const uploadId = v4();
    const songId = v4();
    const safeFilename = sanitizeFilename(dto.filename);
    const storageKey = `uploads/${userId}/${uploadId}/${safeFilename}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await this.prisma.db.uploadSession.create({
      data: {
        id: uploadId,
        userId,
        songId,
        pkg: dto.pkg,
        filename: dto.filename,
        storageKey,
        mimeType: dto.contentType,
        fileSize: dto.fileSize,
        durationSeconds: dto.durationSeconds,
        expiresAt,
      },
    });

    const uploadUrl = await this.storage.presignedPutUrl(storageKey, dto.contentType, 300);

    return {
      uploadId,
      songId,
      uploadUrl,
      credits,
      expiresIn: 300,
    };
  }

  async complete(uploadId: string, userId: string) {
    const session = await this.prisma.db.uploadSession.findUnique({ where: { id: uploadId } });
    if (!session) throw new BadRequestException('Upload session not found or expired');
    if (session.userId !== userId) throw new BadRequestException('Upload session mismatch');
    if (session.completedAt) throw new BadRequestException('Upload session already completed');
    if (session.expiresAt < new Date()) throw new BadRequestException('Upload session expired');

    const credits = PKG_CREDITS[session.pkg] ?? 1;
    const user = await this.prisma.db.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.credits < credits) throw new BadRequestException('Kredit tidak cukup');

    const title = session.filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

    const { song, job } = await this.prisma.db.$transaction(async (tx) => {
      const song = await tx.song.create({
        data: {
          id: session.songId,
          userId,
          title,
          artist: '—',
          filename: session.filename,
          storageKey: session.storageKey,
          mimeType: session.mimeType,
          sizeBytes: session.fileSize,
          duration: session.durationSeconds ?? 0,
        },
      });

      const job = await tx.job.create({
        data: { userId, songId: song.id, pkg: session.pkg, status: 'queued', credits },
      });

      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: credits } },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -credits,
          type: 'deduct',
          description: `Analisis: ${song.title} (${session.pkg})`,
          refId: job.id,
        },
      });

      await tx.uploadSession.update({
        where: { id: uploadId },
        data: { completedAt: new Date() },
      });

      return { song, job };
    });

    return { jobId: job.id, uploadId, status: 'queued', message: 'Analisis dijadwalkan.' };
  }

  async ensureAnalysis(jobId: string, songId: string) {
    const existing = await this.prisma.db.analysis.findUnique({ where: { jobId } });
    if (!existing) {
      await this.prisma.db.analysis.create({
        data: { id: v4(), jobId, songId, ...DEFAULT_ANALYSIS_DATA },
      });
    }
  }
}
