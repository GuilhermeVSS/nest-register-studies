import { Producer } from 'src/producer/domain/entities/producer.entity';
import { ProducerRepository } from '../../domain/repositories/producer.repository';

export interface ListProducerOutput {
  id?: string;
  name?: string;
  cpfCnpj?: string;
}

export class ListProducerUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute(): Promise<ListProducerOutput[]> {
    const producers = await this.producerRepository.list();

    return producers.map((producer: Producer) => ({
      id: producer.id!,
      name: producer.name.value,
      cpfCnpj: producer.cpfCnpj.value,
    }));
  }
}
