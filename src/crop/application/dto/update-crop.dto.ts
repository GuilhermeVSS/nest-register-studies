import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCropDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100, {
    message: 'The crop name must be between 3 and 100 characters long.',
  })
  @ApiProperty({
    description: 'Crops`s name',
    example: 'Cafe',
  })
  name: string;
}
