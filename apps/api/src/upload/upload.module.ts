import { Module } from '@nestjs/common';
import { AnalysisQueueModule } from '../analysis-queue/analysis-queue.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [AnalysisQueueModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
