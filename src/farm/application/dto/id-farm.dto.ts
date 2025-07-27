import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class IdFarmDto {
  @ApiProperty({ description: 'The unique identifier of the farm' })
  @IsUUID('4', { message: 'Invalid farm ID format' })
  id: string;
}
