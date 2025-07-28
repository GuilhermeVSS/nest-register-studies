import { GetDashboardMetricsUseCase } from './get-dashboard-metrics.use-case';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';

describe('GetDashBoardMetricsUseCase', () => {
  let useCase: GetDashboardMetricsUseCase;
  let dashboardRepository: DashboardRepository;

  beforeEach(() => {
    dashboardRepository = {
      getDashboardMetrics: jest.fn(),
    } as DashboardRepository;
    useCase = new GetDashboardMetricsUseCase(dashboardRepository);
  });

  it('shoul validate dashboardMetrics successfully', async () => {
    jest.spyOn(dashboardRepository, 'getDashboardMetrics').mockResolvedValue({
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

    const result = await useCase.execute();

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
