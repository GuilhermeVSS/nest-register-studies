import { Module } from '@nestjs/common';
import { FarmController } from './presentation/controllers/farm.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { FarmPrismaRepository } from './infrastructure/prisma/farm.prisma.repository';

@Module({
  imports: [],
  controllers: [FarmController],
  providers: [FarmPrismaRepository, PrismaService],
  exports: [FarmPrismaRepository],
})
export class FarmModule {}
