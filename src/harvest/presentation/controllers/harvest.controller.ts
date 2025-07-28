import {
  Body,
  Post,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHarvestDto } from '../../application/dto/create-harvest.dto';
import { UpdateHarvestUseCase } from '../../application/use-cases/update-harvest.use-case';
import { CreateHarvestUseCase } from '../../application/use-cases/create-harvest.use-case';
import { HarvestPrismaRepository } from '../../infrastructure/prisma/harvest.prisma.repository';
import { IdHarvestDto } from '../../application/dto/id-harvest.dto';
import { UpdateHarvestDto } from '../../application/dto/update-harvest.dto';
import { DeleteHarvestUseCase } from '../../application/use-cases/delete-harvest.use-case';
@ApiTags('Harvest')
@Controller('api/v1/harvest')
export class HarvestController {
  private readonly createHarvestUseCase: CreateHarvestUseCase;
  private readonly updateHarvestUseCase: UpdateHarvestUseCase;
  private readonly deleteHarvestUseCase: DeleteHarvestUseCase;

  constructor(private readonly harvestRepository: HarvestPrismaRepository) {
    this.createHarvestUseCase = new CreateHarvestUseCase(
      this.harvestRepository,
    );
    this.updateHarvestUseCase = new UpdateHarvestUseCase(
      this.harvestRepository,
    );
    this.deleteHarvestUseCase = new DeleteHarvestUseCase(
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been created successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: A harvest already exists.',
  })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  async update(
    @Param('id') id: IdHarvestDto['id'],
    @Body() dto: UpdateHarvestDto,
  ) {
    return await this.updateHarvestUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 404,
    description: 'Farm not found',
  })
  async delete(@Param('id') id: IdHarvestDto['id']) {
    return await this.deleteHarvestUseCase.execute(id);
  }
}
