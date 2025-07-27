import { HttpCode, HttpStatus, Controller, Get } from '@nestjs/common';

import { ListStateUseCase } from '../../application/use-cases/list-state.use-case';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatePrismaRepository } from '../../infrastructure/prisma/state.prisma.repository';

@ApiTags('States')
@Controller('api/v1/state')
export class StateController {
  private readonly listStateUseCase: ListStateUseCase;

  constructor(private readonly stateRepository: StatePrismaRepository) {
    this.listStateUseCase = new ListStateUseCase(this.stateRepository);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'List of states retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return await this.listStateUseCase.execute();
  }
}
