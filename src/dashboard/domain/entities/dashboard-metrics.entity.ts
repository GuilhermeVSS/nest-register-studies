export interface DashboardMetrics {
  totalFarms: number;
  totalHectares: number;
  farmsByState: FarmsByState[];
  farmsByCrop: FarmsByCrop[];
  farmsByLandUse: FarmsByLandUse;
}

export interface FarmsByState {
  stateId: string;
  stateName: string;
  stateUf: string;
  totalFarms: number;
  totalHectares: number;
}

export interface FarmsByCrop {
  cropName: string;
  totalFarms: number;
}

export interface FarmsByLandUse {
  totalArableArea: number;
  totalVegetationArea: number;
  arableAreaPercentage: number;
  vegetationAreaPercentage: number;
}
