import { Crop } from '../entities/crop.entity';

export interface CropRepository {
  save(producer: Crop): Promise<Crop | Error>;
  findById(id: string): Promise<Crop | null>;
  update(producer: Crop): Promise<Crop>;
  delete(id: string): Promise<void | Error>;
  list(): Promise<Crop[]>;
}
