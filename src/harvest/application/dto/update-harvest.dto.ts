import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateHarvestDto {
  @IsOptional()
  @IsString()
  @Length(3, 100, {
    message: 'The harvest name must be between 3 and 100 characters long.',
  })
  @ApiProperty({
    description: 'Harvest`s name',
    example: 'Harvest Name',
  })
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Year',
    example: 2025,
  })
  year: number;
}
