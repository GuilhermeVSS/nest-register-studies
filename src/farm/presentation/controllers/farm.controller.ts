import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { CreateFarmDto } from '../../application/dto/create-farm.dto';
import { CreateFarmUseCase } from '../../application/use-cases/create-farm.use-case';
import { FarmPrismaRepository } from '../../infrastructure/prisma/farm.prisma.repository';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateFarmUseCase } from '../../application/use-cases/update-farm.use-case';
import { IdFarmDto } from '../..//application/dto/id-farm.dto';
import { UpdateFarmDto } from '../../application/dto/update-form.dto';

@ApiTags('Farms')
@Controller('api/v1/farm')
export class FarmController {
  private readonly createFarmUseCase: CreateFarmUseCase;
  private readonly updateFarmUseCase: UpdateFarmUseCase;
  constructor(private readonly farmRepository: FarmPrismaRepository) {
    this.createFarmUseCase = new CreateFarmUseCase(this.farmRepository);
    this.updateFarmUseCase = new UpdateFarmUseCase(this.farmRepository);
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: A farm already exists.',
  })
  async update(@Param('id') id: IdFarmDto['id'], @Body() dto: UpdateFarmDto) {
    return await this.updateFarmUseCase.execute(dto, id);
  }
}
