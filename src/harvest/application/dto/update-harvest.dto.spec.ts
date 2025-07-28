import { validate } from 'class-validator';
import { UpdateHarvestDto } from './update-harvest.dto';

describe('UpdateHarvestDto', () => {
  it('should validate harvest input successfuylly', async () => {
    const dto = new UpdateHarvestDto();
    dto.name = 'Harvest Test';
    dto.year = 2025;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error due to empty input', async () => {
    const dto = new UpdateHarvestDto();
    dto.name = '';
    dto.year = 2025;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
