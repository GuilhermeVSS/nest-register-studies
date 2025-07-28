import { Harvest } from '../entities/harvest.entity';

export interface HarvestRepository {
  save(producer: Harvest): Promise<Harvest | Error>;
  findById(id: string): Promise<Harvest | null>;
  update(producer: Harvest): Promise<Harvest>;
  delete(id: string): Promise<void | Error>;
  list(): Promise<Harvest[]>;
}
