import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateFarmDto } from '../../application/dto/create-farm.dto';
import { CreateFarmUseCase } from '../../application/use-cases/create-farm.use-case';
import { FarmPrismaRepository } from '../../infrastructure/prisma/farm.prisma.repository';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Farms')
@Controller('api/v1/farm')
export class FarmController {
  private readonly createFarmUseCase: CreateFarmUseCase;
  constructor(private readonly farmRepository: FarmPrismaRepository) {
    this.createFarmUseCase = new CreateFarmUseCase(this.farmRepository);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: A farm already exists.',
  })
  async create(@Body() dto: CreateFarmDto) {
    return await this.createFarmUseCase.execute(dto);
  }
}
