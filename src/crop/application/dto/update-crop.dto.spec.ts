import { validate } from 'class-validator';
import { UpdateCropDto } from './update-crop.dto';

describe('UpdateCropDto', () => {
  it('should validate crop successfully', async () => {
    const dto = new UpdateCropDto();
    dto.name = 'Crop name';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return erro due to empty name', async () => {
    const dto = new UpdateCropDto();
    dto.name = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
