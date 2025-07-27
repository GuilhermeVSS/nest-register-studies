import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';
import { BadRequestException, ConflictException } from '@nestjs/common';

interface CreateProducerInput {
  name: string;
  cpfCnpj: string;
}

export interface CreateProducerOutput {
  id: string;
  name: string;
  cpfCnpj: string;
}

export class CreateProducerUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute(
    input: CreateProducerInput,
  ): Promise<CreateProducerOutput | Error> {
    const cpfCnpjResult = CpfCnpj.create(input.cpfCnpj);

    if (cpfCnpjResult instanceof Error) {
      throw new BadRequestException(cpfCnpjResult.message);
    }

    const nameResult = Name.create(input.name);
    if (nameResult instanceof Error) {
      throw new BadRequestException(nameResult.message);
    }

    const existingProducer = await this.producerRepository.findByCpfCnpj(
      cpfCnpjResult.value,
    );

    if (existingProducer) {
      throw new ConflictException('Producer with this CPF/CNPJ already exists');
    }

    const producer = new Producer({
      name: nameResult,
      cpfCnpj: cpfCnpjResult,
    });

    const savedProducer = await this.producerRepository.save(producer);

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
