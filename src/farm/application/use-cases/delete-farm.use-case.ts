import { FarmRepository } from '../../domain/repositories/farm.repository';
import { NotFoundException } from '@nestjs/common';

export interface DeleteFarmOutput {
  message: string;
  farmId: string;
}

export class DeleteFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(farmId: string): Promise<DeleteFarmOutput | Error> {
    const existingFarm = await this.farmRepository.findById(farmId);

    if (!existingFarm) {
      throw new NotFoundException('Farm was not found.');
    }

    await this.farmRepository.delete(farmId);
    return {
      message: 'Farm deleted successfully',
      farmId,
    };
  }
}
