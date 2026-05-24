import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { UploadModule } from './upload/upload.module';
import { JobsModule } from './jobs/jobs.module';
import { AnalysisModule } from './analysis/analysis.module';
import { CheckoutModule } from './checkout/checkout.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SongsModule,
    UploadModule,
    JobsModule,
    AnalysisModule,
    CheckoutModule,
    AdminModule,
  ],
})
export class AppModule {}
