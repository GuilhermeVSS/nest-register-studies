import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProducerModule } from './producer/producer.module';
import { HarvestModule } from './harvest/harvest.module';
import { FarmModule } from './farm/farm.module';
import { StateModule } from './state/state.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ProducerModule,
    StateModule,
    FarmModule,
    HarvestModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
