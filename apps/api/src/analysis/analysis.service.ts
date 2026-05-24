import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async getByJob(jobId: string, userId: string) {
    const job = await this.prisma.db.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.userId !== userId) throw new ForbiddenException();

    const analysis = await this.prisma.db.analysis.findUnique({ where: { jobId } });
    if (!analysis) throw new NotFoundException('Analysis not found for job');
    return analysis;
  }

  async get(id: string, userId: string) {
    const analysis = await this.prisma.db.analysis.findUnique({
      where: { id },
      include: { job: { select: { userId: true } } },
    });
    if (!analysis) throw new NotFoundException('Analysis not found');
    if (analysis.job.userId !== userId) throw new ForbiddenException();
    return analysis;
  }
}
