import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { CreateProducerDto } from '../../application/dto/create-producer.dto';
import { CreateProducerUseCase } from '../../application/use-cases/create-producer.use-case';
import { UpdateProducerUseCase } from '../../application/use-cases/update-producer.use-case';
import { DeleteProducerUseCase } from '../../application/use-cases/delete-producer.use-case';
import { FindProducerUseCase } from '../../application/use-cases/find-producer.use-case';
import { ListProducerUseCase } from '../../application/use-cases/list-producer.use-case';
import { ProducerPrismaRepository } from '../../infrastructure/prisma/producer.prisma.repository';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateProducerDto } from '../../application/dto/update-producer.dto';
import { IdProducerDto } from 'src/producer/application/dto/id-producer.dto';

@ApiTags('Producers')
@Controller('api/v1/producer')
export class ProducerController {
  private readonly createProducerUseCase: CreateProducerUseCase;
  private readonly updateProducerUseCase: UpdateProducerUseCase;
  private readonly deleteProducerUseCase: DeleteProducerUseCase;
  private readonly findProducerByIdUseCase: FindProducerUseCase;
  private readonly listProducerUseCase: ListProducerUseCase;

  constructor(private readonly producerRepository: ProducerPrismaRepository) {
    this.createProducerUseCase = new CreateProducerUseCase(
      this.producerRepository,
    );
    this.updateProducerUseCase = new UpdateProducerUseCase(
      this.producerRepository,
    );
    this.deleteProducerUseCase = new DeleteProducerUseCase(
      this.producerRepository,
    );
    this.findProducerByIdUseCase = new FindProducerUseCase(
      this.producerRepository,
    );
    this.listProducerUseCase = new ListProducerUseCase(this.producerRepository);
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request due to invalid data.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: IdProducerDto['id'],
    @Body() dto: UpdateProducerDto,
  ) {
    const producer = await this.updateProducerUseCase.execute(dto, id);
    return producer;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Producer does not exist.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async delete(@Param('id') id: IdProducerDto['id']) {
    return await this.deleteProducerUseCase.execute(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Producer found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Producer does not exist.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findById(@Param('id') id: IdProducerDto['id']) {
    return await this.findProducerByIdUseCase.execute(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Producers found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Producer does not exist.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return await this.listProducerUseCase.execute();
  }
}
