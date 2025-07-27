import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { NotFoundException } from '@nestjs/common';

export interface DeleteProducerOutput {
  message: string;
  producerId: string;
}

export class DeleteProducerUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute(producerId: string): Promise<DeleteProducerOutput | Error> {
    const existingProducer = await this.producerRepository.findById(producerId);

    if (!existingProducer) {
      throw new NotFoundException('Producer not found');
    }

    await this.producerRepository.delete(producerId);

    return {
      message: 'Producer deleted successfully',
      producerId,
    };
  }
}
