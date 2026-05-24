import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type JwtUser } from '../auth/current-user.decorator';

@Controller('songs')
@UseGuards(JwtAuthGuard)
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  list(@CurrentUser() user: JwtUser) {
    return this.songsService.list(user.sub);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.songsService.get(id, user.sub);
  }

  @Get(':id/stream-url')
  getStreamUrl(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.songsService.getStreamUrl(id, user.sub);
  }
}
