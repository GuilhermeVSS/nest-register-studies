import { FarmRepository } from '../../domain/repositories/farm.repository';
import { NotFoundException } from '@nestjs/common';

export interface FindFarmOutput {
  id: string;
  name: string;
  city: string;
  producerId: string;
  stateId: string;
  totalArea: number;
  vegetationArea: number;
  arableArea: number;
}

export class FindFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(farmId: string): Promise<FindFarmOutput | Error> {
    const existingFarm = await this.farmRepository.findById(farmId);

    if (!existingFarm) {
      throw new NotFoundException('Farm was not found.');
    }

    return {
      id: existingFarm.id!,
      name: existingFarm.name,
      city: existingFarm.city,
      stateId: existingFarm.stateId,
      producerId: existingFarm.producerId,
      totalArea: existingFarm.totalArea,
      vegetationArea: existingFarm.vegetationArea,
      arableArea: existingFarm.arableArea,
    };
  }
}
