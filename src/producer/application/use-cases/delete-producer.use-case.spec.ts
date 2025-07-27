import { NotFoundException } from '@nestjs/common';
import { DeleteProducerUseCase } from './delete-producer.use-case';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';

describe('DeleteProducerUseCase', () => {
  let useCase: DeleteProducerUseCase;
  let producerRepository: ProducerRepository;

  beforeEach(() => {
    producerRepository = {
      save: jest.fn(),
      findByCpfCnpj: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as ProducerRepository;
    useCase = new DeleteProducerUseCase(producerRepository);
  });

  it('should delete a producer successfully', async () => {
    const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';

    const existingProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create('Old Name') as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    jest
      .spyOn(producerRepository, 'findById')
      .mockResolvedValue(existingProducer);
    jest.spyOn(producerRepository, 'delete').mockResolvedValue(undefined);

    const result = await useCase.execute(producerId);

    expect(result).toEqual({
      message: 'Producer deleted successfully',
      producerId: existingProducer.id,
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
