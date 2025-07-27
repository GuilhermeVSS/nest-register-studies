import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { NotFoundException } from '@nestjs/common';

export interface FindProducerOutput {
  id: string;
  name: string;
  cpfCnpj: string;
}

export class FindProducerUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute(producerId: string): Promise<FindProducerOutput | Error> {
    const existingProducer = await this.producerRepository.findById(producerId);

    if (!existingProducer) {
      throw new NotFoundException('Producer not found');
    }

    return {
      id: existingProducer.id!,
      name: existingProducer.name.value,
      cpfCnpj: existingProducer.cpfCnpj.value,
    };
  }
}
