import { Producer } from '../entities/producer.entity';

export interface ProducerRepository {
  save(producer: Producer): Promise<Producer | Error>;
  findByCpfCnpj(cpfCnpj: string): Promise<Producer | null>;
  findById(id: string): Promise<Producer | null>;
  update(producer: Producer): Promise<Producer>;
  delete(id: string): Promise<void | Error>;
  list(): Promise<Producer[]>;
}
