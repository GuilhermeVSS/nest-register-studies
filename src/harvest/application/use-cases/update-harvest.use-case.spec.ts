import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateHarvestUseCase } from './update-harvest.use-case';
import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { Harvest } from '../../domain/entities/harvest.entity';

describe('UpdateHarvestUseCase', () => {
  let useCase: UpdateHarvestUseCase;
  let harvestRepository: HarvestRepository;

  beforeEach(() => {
    harvestRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as HarvestRepository;
    useCase = new UpdateHarvestUseCase(harvestRepository);
  });

  it('shoul update a harvest successfully', async () => {
    const input = {
      name: 'Harvest New Namme',
      year: 2025,
    };

    const mockHarvest = new Harvest({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Harvest test',
      year: 2025,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    const mockUpdatedHarvest = new Harvest({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Harvest New Namme',
      year: 2026,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(mockHarvest);
    jest
      .spyOn(harvestRepository, 'update')
      .mockResolvedValue(mockUpdatedHarvest);

    const result = await useCase.execute(
      '7457f7e9-8794-4a71-838c-eb688ebc887b',
      input,
    );

    expect(result).toEqual({
      id: mockUpdatedHarvest.id,
      name: mockUpdatedHarvest.name,
      year: mockUpdatedHarvest.year,
      farmId: mockUpdatedHarvest.farmId,
    });
  });

  it('should throw ConflictException when harvest already exists for the same farm and year', async () => {
    const input = {
      name: 'Harvest Test Invalid year',
      year: 2025,
    };

    const mockHarvest = new Harvest({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Harvest test',
      year: 2025,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: {
        target: ['farmId', 'year'],
      },
      message: 'Unique constraint failed on the fields: (`farmId`,`year`)',
    };

    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(mockHarvest);
    jest.spyOn(harvestRepository, 'update').mockRejectedValue(prismaError);

    await expect(
      useCase.execute('7457f7e9-8794-4a71-838c-eb688ebc887b', input),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException due to invalid harvestId', async () => {
    const input = {
      name: 'Harvest test',
      year: 2025,
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

    await expect(
      useCase.execute('7457f7e9-8794-4a71-838c-eb688ebc887b', input),
    ).rejects.toThrow(NotFoundException);
  });
});
