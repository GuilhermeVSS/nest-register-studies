import { CropRepository } from '../../domain/repositories/crop.repository';
import { NotFoundException } from '@nestjs/common';

export interface FindCropOutput {
  id: string;
  name: string;
  harvestId: string;
}

export class FindCropUseCase {
  constructor(private readonly cropRepository: CropRepository) {}
  async execute(id: string): Promise<FindCropOutput | Error> {
    const existingCrop = await this.cropRepository.findById(id);
    if (!existingCrop) {
      throw new NotFoundException('Crop not found');
    }
    return {
      id: existingCrop.id!,
      name: existingCrop.name,
      harvestId: existingCrop.harvestId,
    };
  }
}
