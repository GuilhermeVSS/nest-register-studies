import { FarmController } from './farm.controller';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { FarmPrismaRepository } from '../../infrastructure/prisma/farm.prisma.repository';
import { PrismaService } from 'prisma/prisma.service';

describe('FarmController', () => {
  let controller: FarmController;
  let farmRepository: FarmPrismaRepository;

  beforeEach(() => {
    class MockFarmPrismaRepository extends FarmPrismaRepository {
      save = jest.fn();
      findById = jest.fn();
      update = jest.fn();
      delete = jest.fn();
      list = jest.fn();
      findByNameAndProducerId = jest.fn();
    }
    farmRepository = new MockFarmPrismaRepository({} as PrismaService);
    controller = new FarmController(farmRepository);
  });

  describe('create', () => {
    it('should create a farm successfully', async () => {
      (farmRepository.findByNameAndProducerId as jest.Mock).mockResolvedValue(
        null,
      );
      (farmRepository.save as jest.Mock).mockResolvedValue({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: 'Farm Test',
        city: 'City Test',
        stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      });
      const result = await controller.create({
        name: 'Farm Test',
        city: 'City Test',
        stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      });

      expect(result).toEqual({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: 'Farm Test',
        city: 'City Test',
        stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      });
    });

    it('should return BadReequestException due to wrong sum of areas', async () => {
      (farmRepository.findByNameAndProducerId as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        controller.create({
          name: 'Farm Test',
          city: 'City Test',
          stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
          producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
          totalArea: 5.5,
          vegetationArea: 7.5,
          arableArea: 2.0,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return ConflictException due to existing farm to the same producer', async () => {
      (farmRepository.findByNameAndProducerId as jest.Mock).mockResolvedValue({
        id: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
        name: 'Farm Test',
        city: 'City Test',
        stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      });

      await expect(
        controller.create({
          name: 'Farm Test',
          city: 'City Test',
          stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
          producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
          totalArea: 5.5,
          vegetationArea: 7.5,
          arableArea: 2.0,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
