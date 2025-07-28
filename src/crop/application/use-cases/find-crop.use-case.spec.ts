import { NotFoundException } from '@nestjs/common';
import { FindCropUseCase } from './find-crop.use-case';
import { CropRepository } from '../../domain/repositories/crop.repository';
import { Crop } from '../../domain/entities/crop.entity';

describe('FindCropUseCase', () => {
  let useCase: FindCropUseCase;
  let cropRepository: CropRepository;

  beforeEach(() => {
    cropRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as CropRepository;
    useCase = new FindCropUseCase(cropRepository);
  });

  it('shoul find a crop successfully', async () => {
    const mockCrop = new Crop({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Crop test',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(cropRepository, 'findById').mockResolvedValue(mockCrop);

    const result = await useCase.execute(
      '7457f7e9-8794-4a71-838c-eb688ebc887b',
    );

    expect(result).toEqual({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Crop test',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });
  });

  it('should throw NotFoundException due to invalid cropId', async () => {
    jest.spyOn(cropRepository, 'findById').mockResolvedValue(null);

    await expect(
      useCase.execute('7457f7e9-8794-4a71-838c-eb688ebc887b'),
    ).rejects.toThrow(NotFoundException);
  });
});
