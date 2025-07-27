import { validate } from 'class-validator';
import { UpdateProducerDto, UpdateProducerIdDto } from './update-producer.dto';

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

describe('UpdateProducerIdDto', () => {
  it('it should validate id successfully', async () => {
    const dto = new UpdateProducerIdDto();
    dto.id = '1a8f1fcd-8461-4195-9a11-47be00d8dd43';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid id', async () => {
    const dto = new UpdateProducerIdDto();
    dto.id = 'invalid-id';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
