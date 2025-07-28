import { NotFoundException } from '@nestjs/common';
import { FindHarvestUseCase } from './find-harvest.use-case';
import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { Harvest } from '../../domain/entities/harvest.entity';

describe('FindHarvestUseCase', () => {
  let useCase: FindHarvestUseCase;
  let harvestRepository: HarvestRepository;

  beforeEach(() => {
    harvestRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as HarvestRepository;
    useCase = new FindHarvestUseCase(harvestRepository);
  });

  it('shoul find a harvest successfully', async () => {
    const mockHarvest = new Harvest({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Harvest test',
      year: 2025,
      farmId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(mockHarvest);

    const result = await useCase.execute(
      '7457f7e9-8794-4a71-838c-eb688ebc887b',
    );

    expect(result).toEqual({
      id: mockHarvest.id,
      name: mockHarvest.name,
      year: mockHarvest.year,
      farmId: mockHarvest.farmId,
    });
  });

  it('should throw NotFoundException due to invalid harvestId', async () => {
    jest.spyOn(harvestRepository, 'findById').mockResolvedValue(null);

    await expect(
      useCase.execute('7457f7e9-8794-4a71-838c-eb688ebc887b'),
    ).rejects.toThrow(NotFoundException);
  });
});
