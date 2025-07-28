import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProducerModule } from './producer/producer.module';
import { HarvestModule } from './harvest/harvest.module';
import { FarmModule } from './farm/farm.module';
import { StateModule } from './state/state.module';
import { CropModule } from './crop/crop.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ limit: 10, ttl: 60000 }]),
    PrismaModule,
    ProducerModule,
    StateModule,
    FarmModule,
    CropModule,
    HarvestModule,
    DashboardModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
