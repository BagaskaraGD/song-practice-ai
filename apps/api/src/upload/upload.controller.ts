import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { InitUploadDto } from './upload.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('init')
  init(@Body() dto: InitUploadDto, @CurrentUser() user: JwtUser) {
    return this.uploadService.init(dto, user.sub);
  }

  @Post('complete')
  complete(@Body() body: { uploadId: string }, @CurrentUser() user: JwtUser) {
    return this.uploadService.complete(body.uploadId, user.sub);
  }
}
