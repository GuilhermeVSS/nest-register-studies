import { validate } from 'class-validator';
import { CreateFarmDto } from './create-farm.dto';

describe('CreateFarmDto', () => {
  it('should validate farm input successfuylly', async () => {
    const dto = new CreateFarmDto();
    dto.name = 'Farm Test';
    dto.city = 'City Test';
    dto.stateId = '7457f7e9-8794-4a71-838c-eb688ebc887b';
    dto.producerId = '80ec73f4-47fe-441b-a5ec-b37779a6fc4a';
    dto.totalArea = 5.5;
    dto.vegetationArea = 3.5;
    dto.arableArea = 2.0;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return error due to empty input', async () => {
    const dto = new CreateFarmDto();
    dto.name = 'Farm Test';
    dto.city = 'City Test';
    dto.producerId = '80ec73f4-47fe-441b-a5ec-b37779a6fc4a';
    dto.totalArea = 5.5;
    dto.vegetationArea = 3.5;
    dto.arableArea = 2.0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
