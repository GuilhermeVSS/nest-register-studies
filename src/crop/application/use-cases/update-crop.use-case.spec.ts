import { ConflictException } from '@nestjs/common';
import { UpdateCropUseCase } from './update-crop.use-case';
import { Crop } from '../../domain/entities/crop.entity';
import { CropRepository } from '../../domain/repositories/crop.repository';

describe('UpdateCropUseCase', () => {
  let useCase: UpdateCropUseCase;
  let cropRepository: CropRepository;

  beforeEach(() => {
    cropRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as CropRepository;
    useCase = new UpdateCropUseCase(cropRepository);
  });

  it('should update a crop successfully', async () => {
    const input = {
      name: 'Crop name',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    };

    const mockCrop = new Crop({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Crop Test',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    const mockUpdatedCrop = new Crop({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: input.name,
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });
    jest.spyOn(cropRepository, 'findById').mockResolvedValue(mockCrop);
    jest.spyOn(cropRepository, 'update').mockResolvedValue(mockUpdatedCrop);

    const result = await useCase.execute(
      '7457f7e9-8794-4a71-838c-eb688ebc887b',
      input,
    );

    expect(result).toEqual({
      id: mockUpdatedCrop.id,
      name: mockUpdatedCrop.name,
      harvestId: mockUpdatedCrop.harvestId,
    });
  });

  it('should throw ConflictException when crop already exists for the harvest', async () => {
    const input = {
      name: 'Crop Teste',
    };

    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: {
        target: ['harvestId', 'name'],
      },
      message: 'Unique constraint failed on the fields: (`harvestId`,`name`)',
    };

    const mockCrop = new Crop({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Old Name',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(cropRepository, 'findById').mockResolvedValue(mockCrop);
    jest.spyOn(cropRepository, 'update').mockRejectedValue(prismaError);

    await expect(
      useCase.execute('7457f7e9-8794-4a71-838c-eb688ebc887b', input),
    ).rejects.toThrow(ConflictException);
  });
});
