import { Prisma } from '@prisma/client';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { FarmArea } from '../../domain/value-object/farm-area.vo';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

interface UpdateFarmInput {
  name?: string;
  city?: string;
  totalArea?: number;
  vegetationArea?: number;
  arableArea?: number;
}

export interface UpdateFarmOutput {
  id: string;
  name: string;
  city: string;
  producerId: string;
  stateId: string;
  totalArea: number;
  vegetationArea: number;
  arableArea: number;
}

function updateFields<T>(
  target: T,
  source: Partial<T>,
  fields: (keyof T)[],
): void {
  for (const field of fields) {
    if (source[field] !== undefined) {
      target[field] = source[field] as T[keyof T];
    }
  }
}

export class UpdateFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(
    input: UpdateFarmInput,
    id: string,
  ): Promise<UpdateFarmOutput | Error> {
    const existingFarm = await this.farmRepository.findById(id);

    if (!existingFarm) {
      throw new NotFoundException('Farm was not found.');
    }

    if (input.totalArea && input.arableArea && input.vegetationArea) {
      const farmArea = FarmArea.create({
        totalArea: input.totalArea,
        vegetationArea: input.vegetationArea,
        arableArea: input.arableArea,
      });

      if (farmArea instanceof Error) {
        throw new BadRequestException(farmArea.message);
      }

      existingFarm.updateAreas(farmArea);
    }

    updateFields(existingFarm, input, ['name', 'city']);

    try {
      const savedFarm = await this.farmRepository.update(existingFarm);

      if (savedFarm instanceof Error) {
        throw savedFarm;
      }

      return {
        id: savedFarm.id!,
        name: savedFarm.name,
        city: savedFarm.city,
        stateId: savedFarm.stateId,
        producerId: savedFarm.producerId,
        totalArea: savedFarm.totalArea,
        vegetationArea: savedFarm.vegetationArea,
        arableArea: savedFarm.arableArea,
      };
    } catch (error) {
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002') ||
        (error as { code: string }).code == 'P2002'
      ) {
        throw new ConflictException(
          'A farm with this name already exist for this producer.',
        );
      }

      throw error;
    }
  }
}
