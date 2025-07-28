import { Module } from '@nestjs/common';
import { HarvestController } from './presentation/controllers/harvest.controller';
import { HarvestPrismaRepository } from './infrastructure/prisma/harvest.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [HarvestController],
  providers: [HarvestPrismaRepository, PrismaService],
  exports: [HarvestPrismaRepository],
})
export class HarvestModule {}
