import { validate } from 'class-validator';
import { CreateHarvestDto } from './create-harvest.dto';

describe('CreateHarvestDto', () => {
  it('should validate harvest input successfuylly', async () => {
    const dto = new CreateHarvestDto();
    dto.name = 'Harvest Test';
    dto.farmId = '7457f7e9-8794-4a71-838c-eb688ebc887b';
    dto.year = 2025;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error due to empty input', async () => {
    const dto = new CreateHarvestDto();
    dto.name = '';
    dto.farmId = '7457f7e9-8794-4a71-838c-eb688ebc887b';
    dto.year = 2025;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return error due to invalid farmId', async () => {
    const dto = new CreateHarvestDto();
    dto.name = 'Harves Test';
    dto.farmId = 'invalid-id';
    dto.year = 2025;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
