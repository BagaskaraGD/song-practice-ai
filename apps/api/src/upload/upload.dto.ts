import { IsIn, IsString } from 'class-validator';

export class InitUploadDto {
  @IsString()
  filename: string;

  @IsString()
  mimeType: string;

  @IsIn(['easy', 'original', 'full', 'full_tips'])
  pkg: string;
}
