import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JOB_STEPS, JOB_COMPLETE_SEC } from '../common/constants';

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
        steps: JOB_STEPS.map((s, i) => ({
          id: i + 1,
          label: s.label,
          status: 'done',
          durationMs: s.thresholdSec * 1000,
        })),
      };
    }

    if (job.status === 'failed') {
      return {
        jobId: id,
        status: 'failed',
        progress: 0,
        etaSeconds: 0,
        steps: [],
        error: job.errorMsg,
      };
    }

    // queued or running — estimate progress from elapsed time
    const elapsedSec = Math.floor((Date.now() - job.createdAt.getTime()) / 1000);
    const progress = job.status === 'queued'
      ? 5
      : Math.min(Math.floor((elapsedSec / JOB_COMPLETE_SEC) * 100), 95);
    const etaSeconds = Math.max(JOB_COMPLETE_SEC - elapsedSec, 1);

    const steps = JOB_STEPS.map((s, i) => {
      const prevThreshold = i === 0 ? 0 : JOB_STEPS[i - 1].thresholdSec;
      const stepStatus =
        job.status === 'queued' ? 'pending'
        : elapsedSec >= s.thresholdSec ? 'done'
        : elapsedSec >= prevThreshold ? 'running'
        : 'pending';
      return {
        id: i + 1,
        label: s.label,
        status: stepStatus,
        durationMs: stepStatus === 'done' ? s.thresholdSec * 1000 : null,
      };
    });

    return {
      jobId: id,
      status: job.status === 'queued' ? 'queued' : 'running',
      progress,
      etaSeconds,
      steps,
    };
  }
}
