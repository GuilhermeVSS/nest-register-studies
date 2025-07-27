import { NotFoundException } from '@nestjs/common';
import { FindFarmUseCase } from './find-farm.use-case';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmArea } from '../../domain/value-object/farm-area.vo';

describe('FindFarmUseCase', () => {
  let useCase: FindFarmUseCase;
  let farmRepository: FarmRepository;

  beforeEach(() => {
    farmRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      findByNameAndProducerId: jest.fn(),
    } as FarmRepository;
    useCase = new FindFarmUseCase(farmRepository);
  });

  it('should find a farm successfully', async () => {
    const farmId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';

    const existingFarm = new Farm({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: 'Farm Test',
      city: 'City Test',
      stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      farmArea: FarmArea.create({
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      }) as FarmArea,
    });

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(existingFarm);

    const result = await useCase.execute(farmId);

    expect(result).toEqual({
      id: '1a8f1fcd-8461-4195-9a11-47be00d8dd43',
      name: 'Farm Test',
      city: 'City Test',
      stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      totalArea: 5.5,
      vegetationArea: 3.5,
      arableArea: 2.0,
    });
  });

  it('should throw NotFoundException if farm does not exist', async () => {
    const farmId = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute(farmId)).rejects.toThrow(NotFoundException);
  });
});
