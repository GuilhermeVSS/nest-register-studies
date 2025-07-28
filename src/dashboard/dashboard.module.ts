import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DashboardPrismaRepository } from './infrastructure/prisma/dashboard.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardPrismaRepository, PrismaService],
  exports: [DashboardPrismaRepository],
})
export class DashboardModule {}
