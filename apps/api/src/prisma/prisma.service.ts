import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _client: PrismaClient;
  private _pool: Pool;

  async onModuleInit() {
    this._pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(this._pool);
    this._client = new PrismaClient({ adapter } as any);
    await this._client.$connect();
    this.logger.log('Database connected.');
  }

  async onModuleDestroy() {
    await this._client?.$disconnect();
    await this._pool?.end();
  }

  get db(): PrismaClient {
    return this._client;
  }
}
