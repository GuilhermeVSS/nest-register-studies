import { CropRepository } from '../../domain/repositories/crop.repository';
import { Prisma } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';

interface UpdateCropInput {
  name: string;
}

export interface UpdateCropOutput {
  id: string;
  name: string;
  harvestId: string;
}

export class UpdateCropUseCase {
  constructor(private readonly cropRepository: CropRepository) {}
  async execute(
    id: string,
    input: UpdateCropInput,
  ): Promise<UpdateCropOutput | Error> {
    const existingCrop = await this.cropRepository.findById(id);
    if (!existingCrop) {
      throw new NotFoundException('Crop not found');
    }
    existingCrop.name = input.name;
    try {
      const savedHarvest = await this.cropRepository.update(existingCrop);
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

      throw error;
    }
  }
}
