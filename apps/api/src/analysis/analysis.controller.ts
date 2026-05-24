import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('job/:jobId')
  async getByJob(@Param('jobId') jobId: string, @CurrentUser() user: JwtUser) {
    return this.analysisService.getByJob(jobId, user.sub);
  }

  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.analysisService.get(id, user.sub);
  }
}
