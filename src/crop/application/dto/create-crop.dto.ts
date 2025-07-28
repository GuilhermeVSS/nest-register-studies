import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateCropDto {
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

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Harvest Id',
    example: 'cb098931-cbc2-41f5-96b2-5b47a053cd74',
  })
  harvestId: string;
}
