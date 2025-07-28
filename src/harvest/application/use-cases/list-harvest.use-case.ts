import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { Harvest } from '../../domain/entities/harvest.entity';
export interface ListHarvestOutput {
  id: string;
  name: string;
  year: number;
  farmId: string;
}

export class ListHarvestUseCase {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async execute(): Promise<ListHarvestOutput[]> {
    const harvests = await this.harvestRepository.list();

    return harvests.map((harvest: Harvest) => ({
      id: harvest.id!,
      name: harvest.name,
      year: harvest.year,
      farmId: harvest.farmId,
    }));
  }
}
