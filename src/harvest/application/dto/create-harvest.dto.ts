import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateHarvestDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100, {
    message: 'The harvest name must be between 3 and 100 characters long.',
  })
  @ApiProperty({
    description: 'Harvest`s name',
    example: 'Harvest Name',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Year',
    example: 2025,
  })
  year: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Farm Id',
    example: 'cb098931-cbc2-41f5-96b2-5b47a053cd74',
  })
  farmId: string;
}
