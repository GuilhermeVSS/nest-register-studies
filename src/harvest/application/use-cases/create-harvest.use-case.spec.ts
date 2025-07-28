import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateHarvestUseCase } from './create-harvest.use-case';
import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { Harvest } from '../../domain/entities/harvest.entity';

describe('CreateHarvestUseCase', () => {
  let useCase: CreateHarvestUseCase;
  let harvestRepository: HarvestRepository;

  beforeEach(() => {
    harvestRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as HarvestRepository;
    useCase = new CreateHarvestUseCase(harvestRepository);
  });

  it('shoul create a harvest successfully', async () => {
    const input = {
      name: 'Harvest test',
      year: 2025,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    };

    const mockHarvest = new Harvest({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Harvest test',
      year: 2025,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(harvestRepository, 'save').mockResolvedValue(mockHarvest);

    const result = await useCase.execute(input);

    expect(result).toEqual({
      id: mockHarvest.id,
      name: mockHarvest.name,
      year: mockHarvest.year,
      farmId: mockHarvest.farmId,
    });
  });

  it('should throw ConflictException when harvest already exists for the same farm and year', async () => {
    const input = {
      name: 'Harvest test',
      year: 2025,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    };

    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: {
        target: ['farmId', 'year'],
      },
      message: 'Unique constraint failed on the fields: (`farmId`,`year`)',
    };

    jest.spyOn(harvestRepository, 'save').mockRejectedValue(prismaError);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException due to invalid farmId', async () => {
    const input = {
      name: 'Harvest test',
      year: 2025,
      farmId: 'invalid-farm-id',
    };

    const prismaError = {
      code: 'P2003',
      clientVersion: '5.0.0',
      meta: {
        field_name: 'farmId',
      },
      message: 'Foreign key constraint failed on the field: `farmId`',
    };

    jest.spyOn(harvestRepository, 'save').mockRejectedValue(prismaError);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });
});
