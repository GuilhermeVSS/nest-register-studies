import { NotFoundException } from '@nestjs/common';
import { FindProducerUseCase } from './find-producer.use-case';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';

describe('FindProducerUseCase', () => {
  let useCase: FindProducerUseCase;
  let producerRepository: ProducerRepository;

  beforeEach(() => {
    producerRepository = {
      save: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as ProducerRepository;
    useCase = new FindProducerUseCase(producerRepository);
  });

  it('should find a producer successfully', async () => {
    const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';

    const existingProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create('Old Name') as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    jest
      .spyOn(producerRepository, 'findById')
      .mockResolvedValue(existingProducer);

    const result = await useCase.execute(producerId);

    expect(result).toEqual({
      id: existingProducer.id,
      name: existingProducer.name.value,
      cpfCnpj: existingProducer.cpfCnpj.value,
    });
  });

  it('should throw NotFoundException if producer does not exist', async () => {
    const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';

    jest.spyOn(producerRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute(producerId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
