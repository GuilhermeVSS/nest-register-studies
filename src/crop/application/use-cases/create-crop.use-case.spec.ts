import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateCropUseCase } from './create-crop.use-case';
import { Crop } from '../../domain/entities/crop.entity';
import { CropRepository } from '../../domain/repositories/crop.repository';

describe('CreateCropUseCase', () => {
  let useCase: CreateCropUseCase;
  let cropRepository: CropRepository;

  beforeEach(() => {
    cropRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as CropRepository;
    useCase = new CreateCropUseCase(cropRepository);
  });

  it('should create a crop successfully', async () => {
    const input = {
      name: 'Crop name',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    };

    const mockCrop = new Crop({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Crop Test',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(cropRepository, 'save').mockResolvedValue(mockCrop);

    const result = await useCase.execute(input);

    expect(result).toEqual({
      id: mockCrop.id,
      name: mockCrop.name,
      harvestId: mockCrop.harvestId,
    });
  });

  it('should throw ConflictException when crop already exists for the harvest', async () => {
    const input = {
      name: 'Crop Teste',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    };

    const prismaError = {
      code: 'P2002',
      clientVersion: '5.0.0',
      meta: {
        target: ['harvestId', 'name'],
      },
      message: 'Unique constraint failed on the fields: (`harvestId`,`name`)',
    };

    jest.spyOn(cropRepository, 'save').mockRejectedValue(prismaError);

    await expect(useCase.execute(input)).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException due to invalid harvestId', async () => {
    const input = {
      name: 'Crop test',
      harvestId: 'invalid-harvest-id',
    };

    const prismaError = {
      code: 'P2003',
      clientVersion: '5.0.0',
      meta: {
        field_name: 'harvestId',
      },
      message: 'Foreign key constraint failed on the field: `harvestId`',
    };

    jest.spyOn(cropRepository, 'save').mockRejectedValue(prismaError);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });
});
