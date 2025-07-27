export class FarmArea {
  constructor(
    public readonly arableArea: number,
    public readonly vegetationArea: number,
    public readonly totalArea: number,
  ) {}

  static create(params: {
    arableArea: number;
    vegetationArea: number;
    totalArea: number;
  }): FarmArea | Error {
    if (params.arableArea + params.vegetationArea !== params.totalArea) {
      return new Error(
        'The sum of arable area and vegetation must be equal to the total area.',
      );
    }
    return new FarmArea(
      params.arableArea,
      params.vegetationArea,
      params.totalArea,
    );
  }
}
