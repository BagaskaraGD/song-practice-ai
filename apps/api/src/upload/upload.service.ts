import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { PKG_CREDITS, DEFAULT_ANALYSIS_DATA } from '../common/constants';
import { InitUploadDto } from './upload.dto';

interface PendingUpload {
  filename: string;
  mimeType: string;
  pkg: string;
  songId: string;
  userId: string;
}

@Injectable()
export class UploadService {
  private readonly pending = new Map<string, PendingUpload>();

  constructor(private readonly prisma: PrismaService) {}

  async init(dto: InitUploadDto, userId: string) {
    const uploadId = v4();
    const songId = v4();
    const credits = PKG_CREDITS[dto.pkg] ?? 1;
    this.pending.set(uploadId, {
      filename: dto.filename,
      mimeType: dto.mimeType,
      pkg: dto.pkg,
      songId,
      userId,
    });
    return {
      uploadId,
      songId,
      uploadUrl: `/api/upload/${uploadId}/data`,
      credits,
      expiresIn: 300,
    };
  }

  async complete(uploadId: string, userId: string) {
    const meta = this.pending.get(uploadId);
    if (!meta) throw new BadRequestException('Upload session not found or expired');
    if (meta.userId !== userId) throw new BadRequestException('Upload session mismatch');

    this.pending.delete(uploadId);

    const credits = PKG_CREDITS[meta.pkg] ?? 1;
    const user = await this.prisma.db.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.credits < credits) throw new BadRequestException('Kredit tidak cukup');

    const song = await this.prisma.db.song.create({
      data: {
        id: meta.songId,
        userId,
        title: meta.filename.replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        artist: '—',
        filename: meta.filename,
        mimeType: meta.mimeType,
        sizeBytes: 0,
        duration: 0,
      },
    });

    const job = await this.prisma.db.job.create({
      data: { userId, songId: song.id, pkg: meta.pkg, status: 'queued', credits },
    });

    await this.prisma.db.user.update({
      where: { id: userId },
      data: { credits: { decrement: credits } },
    });

    await this.prisma.db.creditTransaction.create({
      data: {
        userId,
        amount: -credits,
        type: 'deduct',
        description: `Analisis: ${song.title} (${meta.pkg})`,
        refId: job.id,
      },
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
