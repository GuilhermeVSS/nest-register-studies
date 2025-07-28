import { CropRepository } from '../../domain/repositories/crop.repository';
import { NotFoundException } from '@nestjs/common';

export interface DeleteCropOutput {
  message: string;
  cropId: string;
}

export class DeleteCropUseCase {
  constructor(private readonly cropRepository: CropRepository) {}
  async execute(id: string): Promise<DeleteCropOutput | Error> {
    const existingCrop = await this.cropRepository.findById(id);
    if (!existingCrop) {
      throw new NotFoundException('Crop not found');
    }
    await this.cropRepository.delete(id);
    return {
      message: 'Crop has been deleted successfully.',
      cropId: existingCrop.id!,
    };
  }
}
