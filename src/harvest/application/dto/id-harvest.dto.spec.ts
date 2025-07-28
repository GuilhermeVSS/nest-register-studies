import { validate } from 'class-validator';
import { IdHarvestDto } from './id-harvest.dto';

describe('IdHarvestDto', () => {
  it('it should validate Harvest id successfully', async () => {
    const dto = new IdHarvestDto();
    dto.id = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid id', async () => {
    const dto = new IdHarvestDto();
    dto.id = 'invalid-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
