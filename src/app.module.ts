import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ProducerModule } from './producer/producer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ProducerModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
