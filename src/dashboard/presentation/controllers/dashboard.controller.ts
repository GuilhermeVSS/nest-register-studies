import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetDashboardMetricsUseCase } from '../../application/use-cases/get-dashboard-metrics.use-case';
import { DashboardMetrics } from '../../domain/entities/dashboard-metrics.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardPrismaRepository } from '../../infrastructure/prisma/dashboard.prisma.repository';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Dashboard')
@Controller('api/v1/dashboard')
export class DashboardController {
  private readonly getDashBoardMetricsUseCase: GetDashboardMetricsUseCase;
  constructor(private readonly dashBoardRepository: DashboardPrismaRepository) {
    this.getDashBoardMetricsUseCase = new GetDashboardMetricsUseCase(
      this.dashBoardRepository,
    );
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Get('metrics')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Metrics Retrieved' })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getMetrics(): Promise<DashboardMetrics> {
    return await this.getDashBoardMetricsUseCase.execute();
  }
}
