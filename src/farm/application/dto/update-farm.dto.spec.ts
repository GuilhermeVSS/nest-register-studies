import { validate } from 'class-validator';
import { UpdateFarmDto } from './update-form.dto';

describe('UpdateFarmDto', () => {
  it('should validate farm input successfuylly', async () => {
    const dto = new UpdateFarmDto();
    dto.name = 'Farm Test';
    dto.city = 'City Test';
    dto.totalArea = 5.5;
    dto.vegetationArea = 3.5;
    dto.arableArea = 2.0;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error due to invalid name', async () => {
    const dto = new UpdateFarmDto();
    dto.name = 'A';
    dto.city = 'City Test';
    dto.totalArea = 5.5;
    dto.vegetationArea = 3.5;
    dto.arableArea = 2.0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
