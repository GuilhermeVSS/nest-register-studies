import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProducerModule } from './producer/producer.module';
import { StateModule } from './state/state.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ProducerModule, StateModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
