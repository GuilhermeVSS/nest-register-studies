import { HarvestController } from './harvest.controller';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { HarvestPrismaRepository } from '../../infrastructure/prisma/harvest.prisma.repository';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Harvest } from '../../domain/entities/harvest.entity';

describe('HarvestController', () => {
  let controller: HarvestController;
  let harvestRepository: HarvestPrismaRepository;

  beforeEach(() => {
    class MockHarvestPrismaRepository extends HarvestPrismaRepository {
      save = jest.fn();
      findById = jest.fn();
      update = jest.fn();
      delete = jest.fn();
      list = jest.fn();
      findByNameAndProducerId = jest.fn();
    }
    harvestRepository = new MockHarvestPrismaRepository({} as PrismaService);
    controller = new HarvestController(harvestRepository);
  });

  describe('create', () => {
    it('should create a harvest successfully', async () => {
      const input = {
        name: 'Harvest Test',
        year: 2025,
        farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      };

      (harvestRepository.save as jest.Mock).mockResolvedValue(
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: input.name,
          year: input.year,
          farmId: input.farmId,
        }),
      );

      const result = await controller.create(input);

      expect(result).toEqual({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: input.name,
        year: input.year,
        farmId: input.farmId,
      });
    });

    it('should return BadReequestException due to invalid farmId', async () => {
      (harvestRepository.save as jest.Mock).mockRejectedValue({
        code: 'P2003',
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          field_name: 'farmId',
        },
        name: 'PrismaClientKnownRequestError',
        message: 'Foreign key constraint failed on the field: `farmId`',
      });

      await expect(
        controller.create({
          name: 'Harvest Test',
          year: 2025,
          farmId: 'invalid-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return ConflictException due to existing harvest to the same farm', async () => {
      (harvestRepository.save as jest.Mock).mockRejectedValue({
        code: 'P2002',
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          target: ['farmId', 'year'],
        },
        name: 'PrismaClientKnownRequestError',
        message: 'Unique constraint failed on the fields: (`farmId`,`name`)',
      });

      await expect(
        controller.create({
          name: 'Harvest Test',
          year: 2025,
          farmId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a harvest successfully', async () => {
      const input = {
        name: 'Harvest Test',
        year: 2025,
      };

      (harvestRepository.findById as jest.Mock).mockResolvedValue(
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Old name',
          year: 2024,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );
      (harvestRepository.update as jest.Mock).mockResolvedValue(
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: input.name,
          year: input.year,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );

      const result = await controller.update(
        '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        input,
      );

      expect(result).toEqual({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: input.name,
        year: input.year,
        farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      });
    });

    it('should return ConflictException due to existing harvest to the same farm', async () => {
      (harvestRepository.findById as jest.Mock).mockResolvedValue(
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Old name',
          year: 2024,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );
      (harvestRepository.update as jest.Mock).mockRejectedValue({
        code: 'P2002',
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          target: ['farmId', 'year'],
        },
        name: 'PrismaClientKnownRequestError',
        message: 'Unique constraint failed on the fields: (`farmId`,`year`)',
      });

      await expect(
        controller.update('fb9cc64f-a088-4c93-be42-2ec0d826050d', {
          name: 'Harvest Test',
          year: 2025,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete a harvest successfully', async () => {
      (harvestRepository.findById as jest.Mock).mockResolvedValue(
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Old name',
          year: 2024,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );

      const result = await controller.delete(
        'fb9cc64f-a088-4c93-be42-2ec0d826050d',
      );

      expect(result).toEqual({
        harvestId: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        message: 'Harvest has been deleted successfully.',
      });
    });

    it('should throw NotFoundException', async () => {
      (harvestRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        controller.delete('fb9cc64f-a088-4c93-be42-2ec0d826050d'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should find a harvest successfully', async () => {
      (harvestRepository.findById as jest.Mock).mockResolvedValue(
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Old name',
          year: 2024,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );

      const result = await controller.findById(
        'fb9cc64f-a088-4c93-be42-2ec0d826050d',
      );

      expect(result).toEqual({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: 'Old name',
        year: 2024,
        farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      });
    });

    it('should throw NotFoundException', async () => {
      (harvestRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        controller.delete('fb9cc64f-a088-4c93-be42-2ec0d826050d'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should list harvest successfully', async () => {
      (harvestRepository.list as jest.Mock).mockResolvedValue([
        new Harvest({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Old name',
          year: 2024,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      ]);

      const result = await controller.findAll();

      expect(result).toEqual([
        {
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Old name',
          year: 2024,
          farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        },
      ]);
    });
  });
});
