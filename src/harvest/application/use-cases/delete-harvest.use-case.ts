import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { NotFoundException } from '@nestjs/common';

export interface DeleteHarvestOutput {
  message: string;
  harvestId: string;
}

export class DeleteHarvestUseCase {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async execute(id: string): Promise<DeleteHarvestOutput | Error> {
    const existingHarvest = await this.harvestRepository.findById(id);
    if (!existingHarvest) {
      throw new NotFoundException('Harvest not found');
    }

    await this.harvestRepository.delete(id);
    return {
      message: 'Harvest has been deleted successfully.',
      harvestId: id,
    };
  }
}
