import { ListCropUseCase } from './list-crop.use-case';
import { CropRepository } from '../../domain/repositories/crop.repository';
import { Crop } from '../../domain/entities/crop.entity';

describe('ListCropUseCase', () => {
  let useCase: ListCropUseCase;
  let cropRepository: CropRepository;

  beforeEach(() => {
    cropRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    } as CropRepository;
    useCase = new ListCropUseCase(cropRepository);
  });

  it('shoul list a crop successfully', async () => {
    const mockCrop = new Crop({
      id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
      name: 'Crop test',
      harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
    });

    jest.spyOn(cropRepository, 'list').mockResolvedValue([mockCrop]);

    const result = await useCase.execute();

    expect(result).toEqual([
      {
        id: '7457f7e9-8794-4a71-838c-eb688ebc887b',
        name: 'Crop test',
        harvestId: '80ec73f4-47fe-441b-a5ec-b37779a6fc4a',
      },
    ]);
  });
});
