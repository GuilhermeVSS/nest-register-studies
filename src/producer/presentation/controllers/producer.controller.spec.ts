import { ProducerController } from './producer.controller';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ProducerPrismaRepository } from '../../infrastructure/prisma/producer.prisma.repository';
import { PrismaService } from 'prisma/prisma.service';

describe('ProducerController', () => {
  let controller: ProducerController;
  let producerRepository: ProducerPrismaRepository;

  beforeEach(() => {
    class MockProducerPrismaRepository extends ProducerPrismaRepository {
      save = jest.fn();
      findByCpfCnpj = jest.fn();
      findById = jest.fn();
      update = jest.fn();
      delete = jest.fn();
      list = jest.fn();
    }
    producerRepository = new MockProducerPrismaRepository({} as PrismaService);
    controller = new ProducerController(producerRepository);
  });

  describe('create', () => {
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

    it('should return ConflictException due to existing producer', async () => {
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
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const existingProducer = {
        id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
        name: { value: 'Old Name' },
        cpfCnpj: { value: '60899174000' },
      };

      (producerRepository.findById as jest.Mock).mockResolvedValue(
        existingProducer,
      );
      (producerRepository.update as jest.Mock).mockResolvedValue({
        ...existingProducer,
        name: { value: 'Updated Name' },
      });

      const result = await controller.update(
        '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
        {
          name: 'Updated Name',
        },
      );

      expect(result).toEqual({
        id: existingProducer.id,
        name: 'Updated Name',
        cpfCnpj: existingProducer.cpfCnpj.value,
      });
    });

    it('should return BadRequestException due to invalid name', async () => {
      const existingProducer = {
        id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
        name: { value: 'Old Name' },
        cpfCnpj: { value: '60899174000' },
      };

      (producerRepository.findById as jest.Mock).mockResolvedValue(
        existingProducer,
      );

      await expect(
        controller.update('1a8f1fcd-8461-4195-9a11-47be00d8dd43', {
          name: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a producer successfully', async () => {
      const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
      (producerRepository.findById as jest.Mock).mockResolvedValue({
        id: producerId,
        name: { value: 'Producer Name' },
        cpfCnpj: { value: '60899174000' },
      });
      (producerRepository.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.delete(producerId);

      expect(result).toEqual({
        message: 'Producer deleted successfully',
        producerId,
      });
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
      (producerRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(controller.delete(producerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should find a producer by id successfully', async () => {
      const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
      (producerRepository.findById as jest.Mock).mockResolvedValue({
        id: producerId,
        name: { value: 'Producer Name' },
        cpfCnpj: { value: '60899174000' },
      });

      const result = await controller.findById(producerId);
      expect(result).toEqual({
        id: producerId,
        name: 'Producer Name',
        cpfCnpj: '60899174000',
      });
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      const producerId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
      (producerRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(controller.findById(producerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should list all producers successfully', async () => {
      (producerRepository.list as jest.Mock).mockResolvedValue([
        {
          id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
          name: { value: 'Producer Name' },
          cpfCnpj: { value: '60899174000' },
        },
      ]);

      const result = await controller.findAll();
      expect(result).toEqual([
        {
          id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
          name: 'Producer Name',
          cpfCnpj: '60899174000',
        },
      ]);
    });

    it('should return an empty array', async () => {
      (producerRepository.list as jest.Mock).mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });
});
