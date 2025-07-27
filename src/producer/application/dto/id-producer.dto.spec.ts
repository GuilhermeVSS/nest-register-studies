import { validate } from 'class-validator';
import { IdProducerDto } from './id-producer.dto';

describe('IdProducerDto', () => {
  it('it should validate producer id successfully', async () => {
    const dto = new IdProducerDto();
    dto.id = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid id', async () => {
    const dto = new IdProducerDto();
    dto.id = 'invalid-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
