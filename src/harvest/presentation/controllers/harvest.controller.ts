import { Body, Post, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHarvestDto } from '../../application/dto/create-harvest.dto';
import { CreateHarvestUseCase } from '../../application/use-cases/create-harvest.use-case';
import { HarvestPrismaRepository } from '../../infrastructure/prisma/harvest.prisma.repository';

@ApiTags('Harvest')
@Controller('api/v1/harvest')
export class HarvestController {
  private readonly createHarvestUseCase: CreateHarvestUseCase;

  constructor(private readonly harvestRepository: HarvestPrismaRepository) {
    this.createHarvestUseCase = new CreateHarvestUseCase(
      this.harvestRepository,
    );
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
    description: 'Conflict: A harvest already exists.',
  })
  async create(@Body() dto: CreateHarvestDto) {
    return await this.createHarvestUseCase.execute(dto);
  }
}
