import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class SongsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async list(userId: string) {
    return this.prisma.db.song.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { analysis: { select: { key: true, bpm: true } } },
        },
      },
    });
  }

  async get(id: string, userId: string) {
    const song = await this.prisma.db.song.findUnique({
      where: { id },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { analysis: { select: { key: true, bpm: true } } },
        },
      },
    });
    if (!song) throw new NotFoundException('Song not found');
    if (song.userId !== userId) throw new NotFoundException('Song not found');
    return song;
  }

  async getStreamUrl(id: string, userId: string): Promise<{ url: string; expiresIn: number }> {
    const song = await this.prisma.db.song.findUnique({ where: { id } });
    if (!song) throw new NotFoundException('Song not found');
    if (song.userId !== userId) throw new NotFoundException('Song not found');
    if (!song.storageKey) throw new NotFoundException('Audio file not available');

    const url = await this.storage.presignedGetUrl(song.storageKey, 3600);
    return { url, expiresIn: 3600 };
  }
}
