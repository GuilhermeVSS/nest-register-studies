import { Farm } from '../entities/farm.entity';

export interface FarmRepository {
  save(producer: Farm): Promise<Farm | Error>;
  findById(id: string): Promise<Farm | null>;
  update(producer: Farm): Promise<Farm>;
  delete(id: string): Promise<void | Error>;
  list(): Promise<Farm[]>;
  findByNameAndProducerId(
    name: string,
    producerId: string,
  ): Promise<Farm | null>;
}
