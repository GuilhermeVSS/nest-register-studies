import { Module } from '@nestjs/common';
import { CropController } from './presentation/controllers/crop.controller';
import { CropPrismaRepository } from './infrastructure/prisma/crop.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CropController],
  providers: [CropPrismaRepository, PrismaService],
  exports: [CropPrismaRepository],
})
export class CropModule {}
