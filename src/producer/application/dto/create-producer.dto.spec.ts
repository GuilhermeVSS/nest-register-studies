import { validate } from 'class-validator';
import { CreateProducerDto } from './create-producer.dto';

describe('CreateProducerDto', () => {
  it('it should validate CPF/CNPJ and name successfully', async () => {
    const dto = new CreateProducerDto();
    dto.cpfCnpj = '22349605094';
    dto.name = 'Valid Name';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('it should return an error for invalid CPF/CNPJ', async () => {
    const dto = new CreateProducerDto();
    dto.cpfCnpj = '123.456.789-XX';
    dto.name = 'Valid Name';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('it should return an error for invalid name', async () => {
    const dto = new CreateProducerDto();
    dto.cpfCnpj = '22349605094';
    dto.name = 'A';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
