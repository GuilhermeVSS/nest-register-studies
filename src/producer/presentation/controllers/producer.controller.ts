import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateProducerDto } from '../../application/dto/create-producer.dto';
import { CreateProducerUseCase } from 'src/producer/application/use-cases/create-producer.use-case';
import { ProducerPrismaRepository } from 'src/producer/infrastructure/prisma/producer.prisma.repository';

@Controller('api/v1/producer')
export class ProducerController {
  private readonly createProducerUseCase: CreateProducerUseCase;

  constructor(private readonly producerRepository: ProducerPrismaRepository) {
    this.createProducerUseCase = new CreateProducerUseCase(
      this.producerRepository,
    );
  }

  @Post()
  async create(@Body() dto: CreateProducerDto) {
    const producer = await this.createProducerUseCase.execute(dto);
    return producer;
  }
}
