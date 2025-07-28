import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { Harvest } from '../../domain/entities/harvest.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface CreateHarvestInput {
  name: string;
  year: number;
  farmId: string;
}

export interface CreateHarvestOutput {
  id: string;
  name: string;
  year: number;
  farmId: string;
}

export class CreateHarvestUseCase {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async execute(
    input: CreateHarvestInput,
  ): Promise<CreateHarvestOutput | Error> {
    const harvest = new Harvest({
      name: input.name,
      year: input.year,
      farmId: input.farmId,
    });

    try {
      const savedHarvest = await this.harvestRepository.save(harvest);
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
