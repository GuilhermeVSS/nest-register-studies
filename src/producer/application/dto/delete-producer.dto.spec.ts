import { validate } from 'class-validator';
import { DeleteProducerDto } from './delete-producer.dto';

describe('DeleteProducerDto', () => {
  it('it should validate producer id successfully', async () => {
    const dto = new DeleteProducerDto();
    dto.id = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid id', async () => {
    const dto = new DeleteProducerDto();
    dto.id = 'invalid-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
