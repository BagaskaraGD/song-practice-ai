import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SongsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.db.song.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const song = await this.prisma.db.song.findUnique({ where: { id } });
    if (!song) throw new NotFoundException('Song not found');
    return song;
  }
}
