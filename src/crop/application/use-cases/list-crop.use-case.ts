import { CropRepository } from '../../domain/repositories/crop.repository';
import { Crop } from '../../domain/entities/crop.entity';
export interface ListCropOutput {
  id: string;
  name: string;
  harvestId: string;
}

export class ListCropUseCase {
  constructor(private readonly cropRepository: CropRepository) {}
  async execute(): Promise<ListCropOutput[] | Error> {
    const crops = await this.cropRepository.list();

    return crops.map((crop: Crop) => ({
      id: crop.id!,
      name: crop.name,
      harvestId: crop.harvestId,
    }));
  }
}
