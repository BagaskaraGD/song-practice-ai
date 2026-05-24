import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const ALLOWED_MIME = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/flac',
  'audio/x-flac',
  'audio/aac',
  'audio/webm',
] as const;

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export class InitUploadDto {
  @IsString()
  filename: string;

  @IsIn(ALLOWED_MIME)
  contentType: string;

  @IsInt()
  @Min(1)
  @Max(MAX_BYTES)
  fileSize: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationSeconds?: number;

  @IsIn(['easy', 'original', 'full', 'full_tips'])
  pkg: string;
}
