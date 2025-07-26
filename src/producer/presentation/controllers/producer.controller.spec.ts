import { ProducerController } from './producer.controller';
import { BadRequestException } from '@nestjs/common';
import { ProducerPrismaRepository } from '../../infrastructure/prisma/producer.prisma.repository';
import { PrismaService } from 'prisma/prisma.service';

describe('ProducerController', () => {
  let controller: ProducerController;
  let producerRepository: ProducerPrismaRepository;

  beforeEach(() => {
    class MockProducerPrismaRepository extends ProducerPrismaRepository {
      save = jest.fn();
      findByCpfCnpj = jest.fn();
    }
    producerRepository = new MockProducerPrismaRepository({} as PrismaService);
    controller = new ProducerController(producerRepository);
  });

  it('should create a producer succesfully', async () => {
    (producerRepository.findByCpfCnpj as jest.Mock).mockResolvedValue(null);
    (producerRepository.save as jest.Mock).mockResolvedValue({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: { value: 'Producer Name' },
      cpfCnpj: { value: '31101816066' },
    });

    const result = await controller.create({
      name: 'Producer Name',
      cpfCnpj: '31101816066',
    });

    expect(result).toEqual({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: 'Producer Name',
      cpfCnpj: '31101816066',
    });
  });

  it('should return BadRequestException due to invalid CPF/CNPJ', async () => {
    await expect(
      controller.create({
        name: 'Producer Name',
        cpfCnpj: 'invalid-cpf',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return BadRequestException due to empty name', async () => {
    await expect(
      controller.create({
        name: '',
        cpfCnpj: '31101816066',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return BadRequestException due to existing producer', async () => {
    (producerRepository.findByCpfCnpj as jest.Mock).mockResolvedValue({
      id: 'existing-id',
      name: { value: 'Producer Name' },
      cpfCnpj: { value: '31101816066' },
    });

    await expect(
      controller.create({
        name: 'Producer Name',
        cpfCnpj: '31101816066',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
