import { validate } from 'class-validator';
import { IdFarmDto } from './id-farm.dto';

describe('IdFarmDto', () => {
  it('it should validate Farm id successfully', async () => {
    const dto = new IdFarmDto();
    dto.id = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid id', async () => {
    const dto = new IdFarmDto();
    dto.id = 'invalid-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
