import { DashboardController } from './dashboard.controller';
import { DashboardPrismaRepository } from '../../infrastructure/prisma/dashboard.prisma.repository';
import { PrismaService } from 'prisma/prisma.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardRepository: DashboardPrismaRepository;

  beforeEach(() => {
    class MockDashboardPrismaRepository extends DashboardPrismaRepository {
      getDashboardMetrics = jest.fn();
    }
    dashboardRepository = new MockDashboardPrismaRepository(
      {} as PrismaService,
    );
    controller = new DashboardController(dashboardRepository);
  });

  it('Should validate dashBoardMetrics successfully', async () => {
    (dashboardRepository.getDashboardMetrics as jest.Mock).mockResolvedValue({
      totalFarms: 1,
      totalHectares: 50.5,
      farmsByState: [
        {
          stateId: 'd5294a77-5445-4fd0-ab2b-8ca2471178cc',
          stateName: 'Acre',
          stateUf: 'AC',
          totalFarms: 0,
          totalHectares: 0,
        },
      ],
      farmsByCrop: [
        {
          cropName: 'Cafe',
          totalFarms: 1,
        },
        {
          cropName: 'Cana',
          totalFarms: 1,
        },
        {
          cropName: 'Feijao',
          totalFarms: 1,
        },
        {
          cropName: 'Milho',
          totalFarms: 1,
        },
      ],
      farmsByLandUse: {
        totalArableArea: 30.5,
        totalVegetationArea: 20,
        arableAreaPercentage: 60.4,
        vegetationAreaPercentage: 39.6,
      },
    });

    const result = await controller.getMetrics();
    expect(result).toEqual({
      totalFarms: 1,
      totalHectares: 50.5,
      farmsByState: [
        {
          stateId: 'd5294a77-5445-4fd0-ab2b-8ca2471178cc',
          stateName: 'Acre',
          stateUf: 'AC',
          totalFarms: 0,
          totalHectares: 0,
        },
      ],
      farmsByCrop: [
        {
          cropName: 'Cafe',
          totalFarms: 1,
        },
        {
          cropName: 'Cana',
          totalFarms: 1,
        },
        {
          cropName: 'Feijao',
          totalFarms: 1,
        },
        {
          cropName: 'Milho',
          totalFarms: 1,
        },
      ],
      farmsByLandUse: {
        totalArableArea: 30.5,
        totalVegetationArea: 20,
        arableAreaPercentage: 60.4,
        vegetationAreaPercentage: 39.6,
      },
    });
  });
});
