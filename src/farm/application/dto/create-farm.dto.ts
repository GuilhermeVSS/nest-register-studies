import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Length,
} from 'class-validator';

export class CreateFarmDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100, {
    message: 'The farm name must be between 3 and 100 characters long.',
  })
  @ApiProperty({
    description: 'Farm`s name',
    example: 'Farm Name',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'City`s name',
    example: 'City Name',
  })
  city: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'State Id',
    example: 'cb098931-cbc2-41f5-96b2-5b47a053cd74',
  })
  stateId: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Producer Id',
    example: 'cb098931-cbc2-41f5-96b2-5b47a053cd75',
  })
  producerId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Total Area of the farm in hectares',
    example: 5.5,
  })
  totalArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Arable Area of the farm in hectares',
    example: 3.5,
  })
  arableArea: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Vegetation Area of the farm in hectares',
    example: 2.0,
  })
  vegetationArea: number;
}
