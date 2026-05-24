import { Module } from '@nestjs/common';
import { AnalysisQueueModule } from '../analysis-queue/analysis-queue.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AnalysisQueueModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
