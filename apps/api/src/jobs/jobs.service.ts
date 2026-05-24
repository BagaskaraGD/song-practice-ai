import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { JOB_STEPS, JOB_COMPLETE_SEC, DEFAULT_ANALYSIS_DATA } from '../common/constants';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: string) {
    const job = await this.prisma.db.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async progress(id: string) {
    const job = await this.prisma.db.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');

    if (job.status === 'done') {
      return {
        jobId: id,
        status: 'done',
        progress: 100,
        etaSeconds: 0,
        steps: JOB_STEPS.map((s) => ({
          id: JOB_STEPS.indexOf(s) + 1,
          label: s.label,
          status: 'done',
          durationMs: s.thresholdSec * 1000,
        })),
      };
    }

    if (job.status === 'failed') {
      return { jobId: id, status: 'failed', progress: 0, etaSeconds: 0, steps: [], error: job.errorMsg };
    }

    const elapsedSec = Math.floor((Date.now() - job.createdAt.getTime()) / 1000);

    if (elapsedSec >= JOB_COMPLETE_SEC) {
      await this.prisma.db.job.update({
        where: { id },
        data: { status: 'done', latencyMs: elapsedSec * 1000 },
      });

      const existing = await this.prisma.db.analysis.findUnique({ where: { jobId: id } });
      if (!existing) {
        await this.prisma.db.analysis.create({
          data: {
            id: v4(),
            jobId: id,
            songId: job.songId,
            ...DEFAULT_ANALYSIS_DATA,
          },
        });
      }

      return {
        jobId: id,
        status: 'done',
        progress: 100,
        etaSeconds: 0,
        steps: JOB_STEPS.map((s, i) => ({
          id: i + 1,
          label: s.label,
          status: 'done',
          durationMs: s.thresholdSec * 1000,
        })),
      };
    }

    if (job.status === 'queued') {
      await this.prisma.db.job.update({ where: { id }, data: { status: 'running' } });
    }

    const steps = JOB_STEPS.map((s, i) => {
      const prevThreshold = i === 0 ? 0 : JOB_STEPS[i - 1].thresholdSec;
      let status: string;
      let durationMs: number | null = null;

      if (elapsedSec >= s.thresholdSec) {
        status = 'done';
        durationMs = s.thresholdSec * 1000;
      } else if (elapsedSec >= prevThreshold) {
        status = 'running';
      } else {
        status = 'pending';
      }

      return { id: i + 1, label: s.label, status, durationMs };
    });

    const progress = Math.min(Math.floor((elapsedSec / JOB_COMPLETE_SEC) * 100), 95);
    const etaSeconds = JOB_COMPLETE_SEC - elapsedSec;

    return { jobId: id, status: 'running', progress, etaSeconds, steps };
  }
}
