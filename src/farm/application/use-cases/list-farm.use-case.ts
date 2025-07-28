import { FarmRepository } from '../../domain/repositories/farm.repository';
import { Farm } from '../../domain/entities/farm.entity';
export interface ListFarmOutput {
  id: string;
  name: string;
  city: string;
  producerId: string;
  stateId: string;
  totalArea: number;
  vegetationArea: number;
  arableArea: number;
}

export class ListFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(): Promise<ListFarmOutput[]> {
    const farms = await this.farmRepository.list();

    return farms.map((farm: Farm) => ({
      id: farm.id!,
      name: farm.name,
      city: farm.city,
      stateId: farm.stateId,
      producerId: farm.producerId,
      totalArea: farm.totalArea,
      vegetationArea: farm.vegetationArea,
      arableArea: farm.arableArea,
    }));
  }
}
