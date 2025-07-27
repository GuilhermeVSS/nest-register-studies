import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the producer',
    example: 'John Doe',
  })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters long' })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'CPF/CNPJ of the producer, must contain only digits',
    example: '22349605094',
  })
  @Matches(/^\d{11}|\d{14}$/, {
    message: 'CPF must be 11 digits or CNPJ must be 14 digits',
  })
  @Matches(/^\d+$/, { message: 'CPF/CNPJ must contain only digits' })
  cpfCnpj: string;
}
