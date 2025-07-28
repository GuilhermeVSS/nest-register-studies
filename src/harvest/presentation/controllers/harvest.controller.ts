import {
  Body,
  Post,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHarvestDto } from '../../application/dto/create-harvest.dto';
import { UpdateHarvestUseCase } from '../../application/use-cases/update-harvest.use-case';
import { CreateHarvestUseCase } from '../../application/use-cases/create-harvest.use-case';
import { HarvestPrismaRepository } from '../../infrastructure/prisma/harvest.prisma.repository';
import { IdHarvestDto } from '../../application/dto/id-harvest.dto';
import { UpdateHarvestDto } from '../../application/dto/update-harvest.dto';
import { DeleteHarvestUseCase } from '../../application/use-cases/delete-harvest.use-case';
import { FindHarvestUseCase } from '../../application/use-cases/find-harvest.use-case';
import { ListHarvestUseCase } from '../../application/use-cases/list-harvest.use-case';
@ApiTags('Harvest')
@Controller('api/v1/harvest')
export class HarvestController {
  private readonly createHarvestUseCase: CreateHarvestUseCase;
  private readonly updateHarvestUseCase: UpdateHarvestUseCase;
  private readonly deleteHarvestUseCase: DeleteHarvestUseCase;
  private readonly findHarvestUseCase: FindHarvestUseCase;
  private readonly listHarvestUseCase: ListHarvestUseCase;

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
    this.findHarvestUseCase = new FindHarvestUseCase(this.harvestRepository);
    this.listHarvestUseCase = new ListHarvestUseCase(this.harvestRepository);
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
    description: 'Harvest not found',
  })
  async delete(@Param('id') id: IdHarvestDto['id']) {
    return await this.deleteHarvestUseCase.execute(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been found',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 404,
    description: 'Hearvest not found',
  })
  async findById(@Param('id') id: IdHarvestDto['id']) {
    return await this.findHarvestUseCase.execute(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The records has been found',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return await this.listHarvestUseCase.execute();
  }
}
