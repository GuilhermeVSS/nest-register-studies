import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class IdHarvestDto {
  @ApiProperty({ description: 'The unique identifier of the harvest' })
  @IsUUID('4', { message: 'Invalid harvest ID format' })
  id: string;
}
