import { validate } from 'class-validator';
import { UpdateProducerDto } from './update-producer.dto';

describe('UpdateProducerDto', () => {
  it('it should validate name successfully', async () => {
    const dto = new UpdateProducerDto();
    dto.name = 'Valid Name';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid name', async () => {
    const dto = new UpdateProducerDto();
    dto.name = 'A';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
