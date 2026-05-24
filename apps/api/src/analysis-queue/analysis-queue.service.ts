import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ANALYSIS_QUEUE, type AnalysisJobPayload } from './analysis-queue.constants';

export type { AnalysisJobPayload };

@Injectable()
export class AnalysisQueueService {
  constructor(@InjectQueue(ANALYSIS_QUEUE) private readonly queue: Queue) {}

  async enqueue(payload: AnalysisJobPayload): Promise<void> {
    await this.queue.add('process-song-analysis', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
