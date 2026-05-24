import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { v4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_ANALYSIS_DATA } from '../common/constants';
import { ANALYSIS_QUEUE, type AnalysisJobPayload } from './analysis-queue.constants';

const STEPS = [
  { label: 'Unggahan diterima', ms: 2000 },
  { label: 'Mendeteksi kunci & BPM', ms: 3000 },
  { label: 'Memperkirakan akor', ms: 3000 },
  { label: 'Membuat versi mudah', ms: 3000 },
  { label: 'Menyusun lembar latihan', ms: 2000 },
];

const TOTAL_MS = STEPS.reduce((s, x) => s + x.ms, 0);

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

@Processor(ANALYSIS_QUEUE)
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<AnalysisJobPayload>): Promise<void> {
    const { jobId, songId, userId } = job.data;
    const startMs = Date.now();

    this.logger.log(`Processing job ${jobId}`);

    try {
      await this.prisma.db.job.update({
        where: { id: jobId },
        data: { status: 'running' },
      });

      const song = await this.prisma.db.song.findUnique({ where: { id: songId } });
      if (!song) throw new Error(`Song ${songId} not found`);

      let elapsed = 0;
      for (const step of STEPS) {
        await sleep(step.ms);
        elapsed += step.ms;
        await job.updateProgress(Math.round((elapsed / TOTAL_MS) * 90));
      }

      const existing = await this.prisma.db.analysis.findUnique({ where: { jobId } });
      if (existing) {
        await this.prisma.db.analysis.update({
          where: { jobId },
          data: DEFAULT_ANALYSIS_DATA,
        });
      } else {
        await this.prisma.db.analysis.create({
          data: { id: v4(), jobId, songId, ...DEFAULT_ANALYSIS_DATA },
        });
      }

      await this.prisma.db.job.update({
        where: { id: jobId },
        data: { status: 'done', latencyMs: Date.now() - startMs },
      });

      this.logger.log(`Job ${jobId} done in ${Date.now() - startMs}ms`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Job ${jobId} failed: ${msg}`);

      await this.prisma.db.job.update({
        where: { id: jobId },
        data: { status: 'failed', errorMsg: msg },
      });

      const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
      if (isLastAttempt) {
        await this.refundCredits(jobId, userId);
      }

      throw err;
    }
  }

  private async refundCredits(jobId: string, userId: string): Promise<void> {
    const alreadyRefunded = await this.prisma.db.creditTransaction.findFirst({
      where: { refId: jobId, type: 'refund' },
    });
    if (alreadyRefunded) return;

    const dbJob = await this.prisma.db.job.findUnique({ where: { id: jobId } });
    if (!dbJob) return;

    await this.prisma.db.$transaction([
      this.prisma.db.user.update({
        where: { id: userId },
        data: { credits: { increment: dbJob.credits } },
      }),
      this.prisma.db.creditTransaction.create({
        data: {
          userId,
          amount: dbJob.credits,
          type: 'refund',
          description: `Refund otomatis: job ${jobId.slice(0, 8)} gagal`,
          refId: jobId,
        },
      }),
    ]);

    this.logger.log(`Refunded ${dbJob.credits} credits to user ${userId} for job ${jobId}`);
  }
}
