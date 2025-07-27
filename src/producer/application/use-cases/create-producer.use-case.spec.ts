import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateProducerUseCase } from './create-producer.use-case';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';

describe('CreateProducerUseCase', () => {
  let useCase: CreateProducerUseCase;
  let producerRepository: ProducerRepository;

  beforeEach(() => {
    producerRepository = {
      save: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as ProducerRepository;
    useCase = new CreateProducerUseCase(producerRepository);
  });

  it('should create a producer successfully', async () => {
    const input = { name: 'Producer Name', cpfCnpj: '31101816066' };

    const mockProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create(input.name) as Name,
      cpfCnpj: CpfCnpj.create(input.cpfCnpj) as CpfCnpj,
    });

    jest.spyOn(producerRepository, 'findByCpfCnpj').mockResolvedValue(null);
    jest.spyOn(producerRepository, 'save').mockResolvedValue(mockProducer);

    const result = await useCase.execute(input);

    expect(result).toEqual({
      id: mockProducer.id,
      name: mockProducer.name.value,
      cpfCnpj: mockProducer.cpfCnpj.value,
    });
  });

  it('should throw BadRequestException if CPF/CNPJ is invalid', async () => {
    const input = { name: 'Producer Name', cpfCnpj: 'invalid-cpf' };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if name is invalid', async () => {
    const input = { name: '', cpfCnpj: '31101816066' };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if producer already exists', async () => {
    const input = { name: 'Producer Name', cpfCnpj: '31101816066' };
    const mockProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create(input.name) as Name,
      cpfCnpj: CpfCnpj.create(input.cpfCnpj) as CpfCnpj,
    });

    jest
      .spyOn(producerRepository, 'findByCpfCnpj')
      .mockResolvedValue(mockProducer);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
  });
});
