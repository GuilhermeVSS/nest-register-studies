import { CropController } from './crop.controller';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CropPrismaRepository } from '../../infrastructure/prisma/crop.prisma.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Crop } from '../../domain/entities/crop.entity';

describe('CropController', () => {
  let controller: CropController;
  let cropRepository: CropPrismaRepository;

  beforeEach(() => {
    class MockCropPrismaRepository extends CropPrismaRepository {
      save = jest.fn();
      findById = jest.fn();
      update = jest.fn();
      delete = jest.fn();
      list = jest.fn();
    }
    cropRepository = new MockCropPrismaRepository({} as PrismaService);
    controller = new CropController(cropRepository);
  });

  describe('create', () => {
    it('should create a harvest successfully', async () => {
      const input = {
        name: 'Crop Test',
        harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      };

      (cropRepository.save as jest.Mock).mockResolvedValue(
        new Crop({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: input.name,
          harvestId: input.harvestId,
        }),
      );

      const result = await controller.create(input);

      expect(result).toEqual({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: input.name,
        harvestId: input.harvestId,
      });
    });

    it('should return BadReequestException due to invalid harvestId', async () => {
      (cropRepository.save as jest.Mock).mockRejectedValue({
        code: 'P2003',
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          field_name: 'harvestId',
        },
        name: 'PrismaClientKnownRequestError',
        message: 'Foreign key constraint failed on the field: `harvestId`',
      });

      await expect(
        controller.create({
          name: 'Crop Test',
          harvestId: 'invalid-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return ConflictException due to existing harvest to the same farm', async () => {
      (cropRepository.save as jest.Mock).mockRejectedValue({
        code: 'P2002',
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          target: ['harvestId', 'name'],
        },
        name: 'PrismaClientKnownRequestError',
        message: 'Unique constraint failed on the fields: (`harvestId`,`name`)',
      });

      await expect(
        controller.create({
          name: 'Crop Test',
          harvestId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a harvest successfully', async () => {
      const input = {
        name: 'Crop Test',
      };

      (cropRepository.findById as jest.Mock).mockResolvedValue(
        new Crop({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Crop Old Name',
          harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );

      (cropRepository.update as jest.Mock).mockResolvedValue(
        new Crop({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: input.name,
          harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );

      const result = await controller.update(
        'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        input,
      );

      expect(result).toEqual({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: input.name,
        harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      });
    });

    it('should return ConflictException due to existing harvest to the same farm', async () => {
      (cropRepository.findById as jest.Mock).mockResolvedValue(
        new Crop({
          id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
          name: 'Crop Old Name',
          harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        }),
      );

      (cropRepository.update as jest.Mock).mockRejectedValue({
        code: 'P2002',
        clientVersion: Prisma.prismaVersion.client,
        meta: {
          target: ['harvestId', 'name'],
        },
        name: 'PrismaClientKnownRequestError',
        message: 'Unique constraint failed on the fields: (`harvestId`,`name`)',
      });

      await expect(
        controller.update('fb9cc64f-a088-4c93-be42-2ec0d826050d', {
          name: 'Crop Test',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
