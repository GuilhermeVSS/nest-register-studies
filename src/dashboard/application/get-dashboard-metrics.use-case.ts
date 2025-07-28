import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../domain/repositories/dashboard.repository';
import { DashboardMetrics } from '../domain/entities/dashboard-metrics.entity';

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(): Promise<DashboardMetrics> {
    return await this.dashboardRepository.getDashboardMetrics();
  }
}
