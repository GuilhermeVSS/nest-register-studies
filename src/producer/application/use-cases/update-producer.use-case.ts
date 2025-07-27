import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Name } from '../../domain/value-objects/name.vo';
import { BadRequestException, NotFoundException } from '@nestjs/common';

interface UpdateProducerInput {
  name: string;
}

export interface EditProducerOutput {
  id: string;
  name: string;
  cpfCnpj: string;
}

export class UpdateProducerUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute(
    input: UpdateProducerInput,
    producerId: string,
  ): Promise<EditProducerOutput | Error> {
    const existingProducer = await this.producerRepository.findById(producerId);

    if (!existingProducer) {
      throw new NotFoundException('Producer not found');
    }

    const nameResult = Name.create(input.name);
    if (nameResult instanceof Error) {
      throw new BadRequestException(nameResult.message);
    }
    existingProducer.name = nameResult;

    const savedProducer =
      await this.producerRepository.update(existingProducer);

    if (savedProducer instanceof Error) {
      throw savedProducer;
    }

    return {
      id: savedProducer.id!,
      name: savedProducer.name.value,
      cpfCnpj: savedProducer.cpfCnpj.value,
    };
  }
}
