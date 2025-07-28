import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface UpdateHarvestInput {
  name?: string;
  year?: number;
}

export interface UpdateHarvestOutput {
  id: string;
  name: string;
  year: number;
  farmId: string;
}

export class UpdateHarvestUseCase {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async execute(
    id: string,
    input: UpdateHarvestInput,
  ): Promise<UpdateHarvestOutput | Error> {
    const existingHarvest = await this.harvestRepository.findById(id);
    if (!existingHarvest) {
      throw new NotFoundException('Harvest not found');
    }

    Object.assign(existingHarvest, input);

    try {
      const savedHarvest = await this.harvestRepository.update(existingHarvest);
      if (savedHarvest instanceof Error) {
        throw savedHarvest;
      }

      return {
        id: savedHarvest.id!,
        name: savedHarvest.name,
        year: savedHarvest.year,
        farmId: savedHarvest.farmId,
      };
    } catch (error) {
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002') ||
        (error as { code: string }).code == 'P2002'
      ) {
        throw new ConflictException(
          'A harvest with this year already exist for this farm.',
        );
      }

      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2003') ||
        (error as { code: string }).code == 'P2003'
      ) {
        throw new BadRequestException('farmId invalid');
      }

      throw error;
    }
  }
}
