import { BadRequestException } from '@nestjs/common';
import { UpdateProducerUseCase } from './update-producer.use-case';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';

describe('UpdateProducerUseCase', () => {
  let useCase: UpdateProducerUseCase;
  let producerRepository: ProducerRepository;

  beforeEach(() => {
    producerRepository = {
      save: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as ProducerRepository;
    useCase = new UpdateProducerUseCase(producerRepository);
  });

  it('should update a producer successfully', async () => {
    const input = { name: 'Producer Name' };

    const existingProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create('Old Name') as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    const updatedProducer = new Producer({
      id: existingProducer.id,
      name: Name.create(input.name) as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    jest
      .spyOn(producerRepository, 'findById')
      .mockResolvedValue(existingProducer);
    jest.spyOn(producerRepository, 'update').mockResolvedValue(updatedProducer);

    const result = await useCase.execute(
      input,
      '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
    );

    expect(result).toEqual({
      id: updatedProducer.id,
      name: updatedProducer.name.value,
      cpfCnpj: updatedProducer.cpfCnpj.value,
    });
  });

  it('should throw BadRequestException if name is invalid', async () => {
    const input = { name: '' };

    const existingProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create('Old Name') as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    const updatedProducer = new Producer({
      id: existingProducer.id,
      name: Name.create(input.name) as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    jest
      .spyOn(producerRepository, 'findById')
      .mockResolvedValue(existingProducer);
    jest.spyOn(producerRepository, 'update').mockResolvedValue(updatedProducer);

    await expect(
      useCase.execute(input, '1a8f1fcd-8461-4195-9a11-47be00d8dd43'),
    ).rejects.toThrow(BadRequestException);
  });
});
