import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetDashboardMetricsUseCase } from '../../application/use-cases/get-dashboard-metrics.use-case';
import { DashboardMetrics } from '../../domain/entities/dashboard-metrics.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardPrismaRepository } from '../../infrastructure/prisma/dashboard.prisma.repository';

@ApiTags('Dashboard')
@Controller('api/v1/dashboard')
export class DashboardController {
  private readonly getDashBoardMetricsUseCase: GetDashboardMetricsUseCase;
  constructor(private readonly dashBoardRepository: DashboardPrismaRepository) {
    this.getDashBoardMetricsUseCase = new GetDashboardMetricsUseCase(
      this.dashBoardRepository,
    );
  }

  @Get('metrics')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Metrics Retrieved' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getMetrics(): Promise<DashboardMetrics> {
    return await this.getDashBoardMetricsUseCase.execute();
  }
}
