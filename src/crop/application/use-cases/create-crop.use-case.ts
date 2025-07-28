import { CropRepository } from '../../domain/repositories/crop.repository';
import { Crop } from '../../domain/entities/crop.entity';
import { Prisma } from '@prisma/client';
import { BadRequestException, ConflictException } from '@nestjs/common';

interface CreateCropInput {
  name: string;
  harvestId: string;
}

export interface CreateCropOutput {
  id: string;
  name: string;
  harvestId: string;
}

export class CreateCropUseCase {
  constructor(private readonly cropRepository: CropRepository) {}
  async execute(input: CreateCropInput): Promise<CreateCropOutput | Error> {
    const crop = new Crop({
      name: input.name,
      harvestId: input.harvestId,
    });

    try {
      const savedHarvest = await this.cropRepository.save(crop);
      if (savedHarvest instanceof Error) {
        throw savedHarvest;
      }

      return {
        id: savedHarvest.id!,
        name: savedHarvest.name,
        harvestId: savedHarvest.harvestId,
      };
    } catch (error) {
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002') ||
        (error as { code: string }).code == 'P2002'
      ) {
        throw new ConflictException(
          'A crop with this name already exist for this harvest.',
        );
      }

      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003') ||
        (error as { code: string }).code == 'P2003'
      ) {
        throw new BadRequestException('harvestId invalid');
      }

      throw error;
    }
  }
}
