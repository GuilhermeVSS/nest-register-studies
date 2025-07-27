import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Length, IsOptional } from 'class-validator';

export class UpdateFarmDto {
  @IsOptional()
  @IsString()
  @Length(3, 100, {
    message: 'The farm name must be between 3 and 100 characters long.',
  })
  @ApiProperty({
    description: 'Farm`s name',
    example: 'Farm Name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'City`s name',
    example: 'City Name',
  })
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Total Area of the farm in hectares',
    example: 5.5,
  })
  totalArea?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Arable Area of the farm in hectares',
    example: 3.5,
  })
  arableArea?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Vegetation Area of the farm in hectares',
    example: 2.0,
  })
  vegetationArea?: number;
}
