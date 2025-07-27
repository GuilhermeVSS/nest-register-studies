import { FarmRepository } from '../../domain/repositories/farm.repository';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmArea } from '../../domain/value-object/farm-area.vo';
import { BadRequestException, ConflictException } from '@nestjs/common';

interface CreateFarmInput {
  name: string;
  city: string;
  producerId: string;
  stateId: string;
  totalArea: number;
  vegetationArea: number;
  arableArea: number;
}

export interface CreateFarmOutput {
  id: string;
  name: string;
  city: string;
  producerId: string;
  stateId: string;
  totalArea: number;
  vegetationArea: number;
  arableArea: number;
}

export class CreateFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(input: CreateFarmInput): Promise<CreateFarmOutput | Error> {
    const existingFarm = await this.farmRepository.findByNameAndProducerId(
      input.name,
      input.producerId,
    );

    if (existingFarm) {
      throw new ConflictException(
        'A farm with this name already exist for this producer.',
      );
    }

    const farmArea = FarmArea.create({
      totalArea: input.totalArea,
      vegetationArea: input.vegetationArea,
      arableArea: input.arableArea,
    });

    if (farmArea instanceof Error) {
      throw new BadRequestException(farmArea.message);
    }

    const farm = new Farm({
      name: input.name,
      city: input.city,
      stateId: input.stateId,
      producerId: input.producerId,
      farmArea,
    });

    const savedFarm = await this.farmRepository.save(farm);
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
  }
}
