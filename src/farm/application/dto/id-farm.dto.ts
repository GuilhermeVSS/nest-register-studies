import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class IdFarmDto {
  @ApiProperty({ description: 'The unique identifier of the producer' })
  @IsUUID('4', { message: 'Invalid producer ID format' })
  id: string;
}
