import { DashboardMetrics } from '../entities/dashboard-metrics.entity';

export interface DashboardRepository {
  getDashboardMetrics(): Promise<DashboardMetrics>;
}
