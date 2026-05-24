import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':id/progress')
  async progress(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    const job = await this.jobsService.get(id);
    if (job.userId !== user.sub) throw new ForbiddenException();
    return this.jobsService.progress(id);
  }
}
