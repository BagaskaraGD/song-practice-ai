import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ANALYSIS_QUEUE } from './analysis-queue.constants';
import { AnalysisQueueService } from './analysis-queue.service';
import { AnalysisProcessor } from './analysis.processor';

@Module({
  imports: [BullModule.registerQueue({ name: ANALYSIS_QUEUE })],
  providers: [AnalysisQueueService, AnalysisProcessor],
  exports: [AnalysisQueueService],
})
export class AnalysisQueueModule {}
