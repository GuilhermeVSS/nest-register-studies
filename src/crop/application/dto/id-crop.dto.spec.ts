import { validate } from 'class-validator';
import { IdCropDto } from './id-crop.dto';

describe('IdCropDto', () => {
  it('it should validate Crop id successfully', async () => {
    const dto = new IdCropDto();
    dto.id = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid id', async () => {
    const dto = new IdCropDto();
    dto.id = 'invalid-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
