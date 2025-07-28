import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCropUseCase } from '../../application/use-cases/create-crop.use-case';
import { CropPrismaRepository } from '../../infrastructure/prisma/crop.prisma.repository';
import { CreateCropDto } from '../../application/dto/create-crop.dto';
import { IdCropDto } from '../../application/dto/id-crop.dto';
import { UpdateCropDto } from '../../application/dto/update-crop.dto';
import { UpdateCropUseCase } from '../../application/use-cases/update-crop.use-case';
import { DeleteCropUseCase } from '../../application/use-cases/delete-crop.use-case';
import { FindCropUseCase } from '../../application/use-cases/find-crop.use-case';
import { ListCropUseCase } from '../../application/use-cases/list-crop.use-case';
@ApiTags('Crops')
@Controller('api/v1/crop')
export class CropController {
  private readonly createCropUseCase: CreateCropUseCase;
  private readonly updateCropUseCase: UpdateCropUseCase;
  private readonly deleteCropUseCase: DeleteCropUseCase;
  private readonly findCropUseCase: FindCropUseCase;
  private readonly listCropUseCase: ListCropUseCase;

  constructor(private readonly cropRepository: CropPrismaRepository) {
    this.createCropUseCase = new CreateCropUseCase(this.cropRepository);
    this.updateCropUseCase = new UpdateCropUseCase(this.cropRepository);
    this.deleteCropUseCase = new DeleteCropUseCase(this.cropRepository);
    this.findCropUseCase = new FindCropUseCase(this.cropRepository);
    this.listCropUseCase = new ListCropUseCase(this.cropRepository);
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
    description: 'Conflict: A crop already exists.',
  })
  async create(@Body() dto: CreateCropDto) {
    return await this.createCropUseCase.execute(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Crop not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: A crop already exists.',
  })
  async update(@Param('id') id: IdCropDto['id'], @Body() dto: UpdateCropDto) {
    return await this.updateCropUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Crop not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async delete(@Param('id') id: IdCropDto['id']) {
    return await this.deleteCropUseCase.execute(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been found',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Crop not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findById(@Param('id') id: IdCropDto['id']) {
    return await this.findCropUseCase.execute(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'The record has been found',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return await this.listCropUseCase.execute();
  }
}
