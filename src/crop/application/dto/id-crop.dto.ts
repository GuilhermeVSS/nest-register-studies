import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class IdCropDto {
  @ApiProperty({ description: 'The unique identifier of the crop' })
  @IsUUID('4', { message: 'Invalid Crop ID format' })
  id: string;
}
