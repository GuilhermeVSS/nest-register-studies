import {
  Body,
  Controller,
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
@ApiTags('Crops')
@Controller('api/v1/crop')
export class CropController {
  private readonly createCropUseCase: CreateCropUseCase;
  private readonly updateCropUseCase: UpdateCropUseCase;
  constructor(private readonly cropRepository: CropPrismaRepository) {
    this.createCropUseCase = new CreateCropUseCase(this.cropRepository);
    this.updateCropUseCase = new UpdateCropUseCase(this.cropRepository);
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
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict: A crop already exists.',
  })
  async update(@Param('id') id: IdCropDto['id'], @Body() dto: UpdateCropDto) {
    return await this.updateCropUseCase.execute(id, dto);
  }
}
