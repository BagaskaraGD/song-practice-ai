import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
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
  async get(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    const song = await this.songsService.get(id);
    if (song.userId !== user.sub) throw new ForbiddenException();
    return song;
  }
}
