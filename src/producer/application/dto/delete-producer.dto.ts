import { IsUUID } from 'class-validator';

export class DeleteProducerDto {
  @IsUUID('4', { message: 'Invalid producer ID format' })
  id: string;
}
