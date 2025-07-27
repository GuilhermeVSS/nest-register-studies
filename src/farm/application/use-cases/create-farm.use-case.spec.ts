import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateFarmUseCase } from './create-farm.use-case';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmArea } from '../../domain/value-object/farm-area.vo';

describe('CreateFarmUseCase', () => {
  let useCase: CreateFarmUseCase;
  let farmRepository: FarmRepository;

  beforeEach(() => {
    farmRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByNameAndProducerId: jest.fn(),
      list: jest.fn(),
    } as FarmRepository;
    useCase = new CreateFarmUseCase(farmRepository);
  });

  it('should create a farm successfully', async () => {
    const input = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      totalArea: 5.5,
      vegetationArea: 3.5,
      arableArea: 2.0,
    };

    const mockFarm = new Farm({
      id: 'cb098931-cbc2-41f5-96b2-5b47a053cd74',
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

    jest
      .spyOn(farmRepository, 'findByNameAndProducerId')
      .mockResolvedValue(null);
    jest.spyOn(farmRepository, 'save').mockResolvedValue(mockFarm);

    const result = await useCase.execute(input);

    expect(result).toEqual({
      id: mockFarm.id,
      name: mockFarm.name,
      city: mockFarm.city,
      totalArea: mockFarm.totalArea,
      vegetationArea: mockFarm.vegetationArea,
      arableArea: mockFarm.arableArea,
      stateId: mockFarm.stateId,
      producerId: mockFarm.producerId,
    });
  });

  it('should return BadRequestException due to wrong sum of areas', async () => {
    const input = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      totalArea: 5.5,
      vegetationArea: 7.5,
      arableArea: 2.0,
    };

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });

  it('should return Conflict due to wrong sum of areas', async () => {
    const input = {
      name: 'Farm Test',
      city: 'City Test',
      stateId: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      producerId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      totalArea: 5.5,
      vegetationArea: 7.5,
      arableArea: 2.0,
    };

    const mockFarm = new Farm({
      id: 'cb098931-cbc2-41f5-96b2-5b47a053cd74',
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

    jest
      .spyOn(farmRepository, 'findByNameAndProducerId')
      .mockResolvedValue(mockFarm);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
  });
});
