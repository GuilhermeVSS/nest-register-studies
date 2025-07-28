import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { NotFoundException } from '@nestjs/common';

export interface FindHarvestOutput {
  id: string;
  name: string;
  year: number;
  farmId: string;
}

export class FindHarvestUseCase {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async execute(id: string): Promise<FindHarvestOutput | Error> {
    const existingHarvest = await this.harvestRepository.findById(id);
    if (!existingHarvest) {
      throw new NotFoundException('Harvest not found');
    }

    await this.harvestRepository.delete(id);
    return {
      id: existingHarvest.id!,
      name: existingHarvest.name,
      year: existingHarvest.year,
      farmId: existingHarvest.farmId,
    };
  }
}
