import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProducerDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the producer',
    example: 'John Doe',
  })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters long' })
  name: string;
}
