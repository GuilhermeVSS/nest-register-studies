import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';
import {
  DashboardMetrics,
  FarmsByState,
  FarmsByCrop,
  FarmsByLandUse,
} from '../../domain/entities/dashboard-metrics.entity';

@Injectable()
export class DashboardPrismaRepository implements DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [
      totalFarms,
      totalHectares,
      farmsByState,
      farmsByCrop,
      farmsByLandUse,
    ] = await Promise.all([
      this.getTotalFarms(),
      this.getTotalHectares(),
      this.getFarmsByState(),
      this.getFarmsByCrop(),
      this.getFarmsByLandUse(),
    ]);

    return {
      totalFarms,
      totalHectares,
      farmsByState,
      farmsByCrop,
      farmsByLandUse,
    };
  }

  private async getTotalFarms(): Promise<number> {
    return await this.prisma.farm.count();
  }

  private async getTotalHectares(): Promise<number> {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
      },
    });

    return result._sum.totalArea ?? 0;
  }

  private async getFarmsByState(): Promise<FarmsByState[]> {
    const results = await this.prisma.state.findMany({
      select: {
        id: true,
        name: true,
        uf: true,
        farms: {
          select: {
            totalArea: true,
          },
        },
      },
    });

    return results.map((state) => ({
      stateId: state.id,
      stateName: state.name,
      stateUf: state.uf,
      totalFarms: state.farms.length,
      totalHectares: state.farms.reduce((sum, farm) => sum + farm.totalArea, 0),
    }));
  }

  private async getFarmsByCrop(): Promise<FarmsByCrop[]> {
    const results = await this.prisma.crop.groupBy({
      by: ['name'],
      _count: {
        id: true,
      },
    });

    return results.map((crop) => ({
      cropName: crop.name,
      totalFarms: crop._count.id,
    }));
  }

  private async getFarmsByLandUse(): Promise<FarmsByLandUse> {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
        totalArea: true,
      },
    });

    const totalArableArea = result._sum.arableArea ?? 0;
    const totalVegetationArea = result._sum.vegetationArea ?? 0;
    const totalArea = result._sum.totalArea ?? 0;

    const arableAreaPercentage =
      totalArea > 0 ? (totalArableArea / totalArea) * 100 : 0;
    const vegetationAreaPercentage =
      totalArea > 0 ? (totalVegetationArea / totalArea) * 100 : 0;

    return {
      totalArableArea,
      totalVegetationArea,
      arableAreaPercentage: Number(arableAreaPercentage.toFixed(2)),
      vegetationAreaPercentage: Number(vegetationAreaPercentage.toFixed(2)),
    };
  }
}
