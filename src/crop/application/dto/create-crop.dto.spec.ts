import { validate } from 'class-validator';
import { CreateCropDto } from './create-crop.dto';

describe('CreateCropDto', () => {
  it('should validate crop successfully', async () => {
    const dto = new CreateCropDto();
    dto.name = 'Crop name';
    dto.harvestId = '7457f7e9-8794-4a71-838c-eb688ebc887b';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return erro due to empty name', async () => {
    const dto = new CreateCropDto();
    dto.name = '';
    dto.harvestId = '7457f7e9-8794-4a71-838c-eb688ebc887b';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return erro due to invalid harvestId', async () => {
    const dto = new CreateCropDto();
    dto.name = 'Crop name';
    dto.harvestId = 'invalid-uui-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
