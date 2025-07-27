import { Module } from '@nestjs/common';
import { StateController } from './presentation/controllers/state.controller';
import { StatePrismaRepository } from './infrastructure/prisma/state.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [StateController],
  providers: [StatePrismaRepository, PrismaService],
  exports: [StatePrismaRepository],
})
export class StateModule {}
