import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalysisQueueService } from '../analysis-queue/analysis-queue.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analysisQueue: AnalysisQueueService,
  ) {}

  async stats(range: string) {
    const rangeHours: Record<string, number> = { '1d': 24, '7d': 168, '30d': 720, '90d': 2160 };
    const hours = rangeHours[range ?? '7d'] ?? 168;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const [totalUsers, totalJobs, doneJobs, failedJobs, runningJobs, queuedJobs, jobs24h, failed24h] =
      await Promise.all([
        this.prisma.db.user.count(),
        this.prisma.db.job.count(),
        this.prisma.db.job.count({ where: { status: 'done' } }),
        this.prisma.db.job.count({ where: { status: 'failed' } }),
        this.prisma.db.job.count({ where: { status: 'running' } }),
        this.prisma.db.job.count({ where: { status: 'queued' } }),
        this.prisma.db.job.count({ where: { createdAt: { gte: since } } }),
        this.prisma.db.job.count({ where: { status: 'failed', createdAt: { gte: since } } }),
      ]);

    const successRate = totalJobs > 0 ? ((doneJobs / totalJobs) * 100).toFixed(1) : '0';

    const avgLatency = await this.prisma.db.job.aggregate({
      _avg: { latencyMs: true },
      where: { status: 'done', latencyMs: { not: null } },
    });

    const p95 = avgLatency._avg.latencyMs
      ? `${((avgLatency._avg.latencyMs * 1.3) / 1000).toFixed(1)} dtk`
      : '—';

    return {
      range: range ?? '7d',
      kpis: [
        { label: 'Total Pengguna', value: totalUsers.toLocaleString('id'), delta: '+0%', accent: 'violet' },
        { label: 'Lagu Dianalisis', value: totalJobs.toLocaleString('id'), delta: `+${jobs24h} hari ini`, accent: 'pink' },
        { label: 'Tingkat Sukses', value: `${successRate}%`, delta: doneJobs > 0 ? `${doneJobs} selesai` : '—', accent: 'violet' },
        { label: 'Job Gagal', value: failedJobs.toLocaleString('id'), delta: `${failed24h} (24 jam)`, accent: 'pink' },
        { label: 'Kredit Terpakai', value: (doneJobs * 3).toLocaleString('id'), delta: 'estimasi rata-rata 3k', accent: 'violet' },
      ],
      queue: {
        running: runningJobs,
        queued: queuedJobs,
        latencyP95: p95,
        failed24h,
      },
    };
  }

  async recentJobs(limit: number) {
    const jobs = await this.prisma.db.job.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        song: { select: { title: true } },
      },
    });

    return jobs.map((j) => ({
      id: j.id.slice(0, 8).toUpperCase(),
      user: j.user.email,
      song: j.song.title,
      credits: j.credits,
      status: j.status,
      latency: j.latencyMs ? `${(j.latencyMs / 1000).toFixed(1)} dtk` : '—',
    }));
  }

  async refundQueue() {
    const failedJobs = await this.prisma.db.job.findMany({
      where: { status: 'failed' },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { email: true } },
        song: { select: { title: true, artist: true } },
      },
    });

    return failedJobs.map((j) => ({
      id: j.id.slice(0, 8).toUpperCase(),
      user: j.user.email,
      song: `${j.song.title} — ${j.song.artist}`,
      error: j.errorMsg ?? 'ERR_UNKNOWN',
      credits: j.credits,
    }));
  }

  async approveRefund(jobId: string) {
    const job = await this.prisma.db.job.findFirst({
      where: { OR: [{ id: jobId }, { id: { startsWith: jobId.toLowerCase() } }] },
      include: { user: true },
    });

    if (job) {
      await this.prisma.db.user.update({
        where: { id: job.userId },
        data: { credits: { increment: job.credits } },
      });

      await this.prisma.db.creditTransaction.create({
        data: {
          userId: job.userId,
          amount: job.credits,
          type: 'refund',
          description: `Refund job ${job.id.slice(0, 8)}`,
          refId: job.id,
        },
      });
    }

    return { jobId, action: 'refund_approved', creditsReturned: job?.credits ?? 0 };
  }

  async retryJob(jobId: string) {
    const job = await this.prisma.db.job.findFirst({
      where: { OR: [{ id: jobId }, { id: { startsWith: jobId.toLowerCase() } }] },
    });

    if (!job) throw new BadRequestException('Job not found');
    if (job.status !== 'failed') throw new BadRequestException('Only failed jobs can be retried');

    await this.prisma.db.job.update({
      where: { id: job.id },
      data: { status: 'queued', errorMsg: null },
    });

    await this.analysisQueue.enqueue({
      jobId: job.id,
      songId: job.songId,
      userId: job.userId,
    });

    return { jobId: job.id, action: 'retry_queued', newJobId: job.id };
  }
}
