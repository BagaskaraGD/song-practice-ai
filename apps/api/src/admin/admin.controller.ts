import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  stats(@Query('range') range: string) {
    return this.adminService.stats(range);
  }

  @Get('jobs')
  jobs(@Query('limit') limit: string) {
    return this.adminService.recentJobs(limit ? parseInt(limit) : 20);
  }

  @Get('refunds')
  refunds() {
    return this.adminService.refundQueue();
  }

  @Post('refunds/:jobId/approve')
  approveRefund(@Param('jobId') jobId: string) {
    return this.adminService.approveRefund(jobId);
  }

  @Post('jobs/:jobId/retry')
  retryJob(@Param('jobId') jobId: string) {
    return this.adminService.retryJob(jobId);
  }
}
