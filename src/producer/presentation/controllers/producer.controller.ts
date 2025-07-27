import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateProducerDto } from '../../application/dto/create-producer.dto';
import { CreateProducerUseCase } from '../../application/use-cases/create-producer.use-case';
import { ProducerPrismaRepository } from '../../infrastructure/prisma/producer.prisma.repository';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Producers')
@Controller('api/v1/producer')
export class ProducerController {
  private readonly createProducerUseCase: CreateProducerUseCase;

  constructor(private readonly producerRepository: ProducerPrismaRepository) {
    this.createProducerUseCase = new CreateProducerUseCase(
      this.producerRepository,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Producer already exists.',
  })
  async create(@Body() dto: CreateProducerDto) {
    const producer = await this.createProducerUseCase.execute(dto);
    return producer;
  }
}
