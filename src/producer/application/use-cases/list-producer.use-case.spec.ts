import { ListProducerUseCase } from './list-producer.use-case';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';

describe('ListProducerUseCase', () => {
  let useCase: ListProducerUseCase;
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
    useCase = new ListProducerUseCase(producerRepository);
  });

  it('should list producers successfully', async () => {
    const existingProducer = new Producer({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: Name.create('Old Name') as Name,
      cpfCnpj: CpfCnpj.create('60899174000') as CpfCnpj,
    });

    jest
      .spyOn(producerRepository, 'list')
      .mockResolvedValue([existingProducer]);

    const result = await useCase.execute();

    expect(result).toEqual([
      {
        id: existingProducer.id,
        name: existingProducer.name.value,
        cpfCnpj: existingProducer.cpfCnpj.value,
      },
    ]);
  });

  it('should return an empty array if no producers exist', async () => {
    jest.spyOn(producerRepository, 'list').mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
