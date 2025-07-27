import { FarmArea } from '../value-object/farm-area.vo';

export class Farm {
  private _id?: string;
  private _name: string;
  private _city: string;
  private _stateId: string;
  private _producerId: string;
  private _totalArea: number;
  private _arableArea: number;
  private _vegetationArea: number;

  constructor(params: {
    id?: string;
    name: string;
    city: string;
    stateId: string;
    producerId: string;
    farmArea: FarmArea;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._city = params.city;
    this._stateId = params.stateId;
    this._producerId = params.producerId;
    this._totalArea = params.farmArea.totalArea;
    this._arableArea = params.farmArea.arableArea;
    this._vegetationArea = params.farmArea.vegetationArea;
  }
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get city(): string {
    return this._city;
  }

  get stateId(): string {
    return this._stateId;
  }

  get producerId(): string {
    return this._producerId;
  }

  get totalArea(): number {
    return this._totalArea;
  }

  get arableArea(): number {
    return this._arableArea;
  }

  get vegetationArea(): number {
    return this._vegetationArea;
  }

  updateAreas(farmArea: FarmArea): void {
    this._totalArea = farmArea.totalArea;
    this._arableArea = farmArea.arableArea;
    this._vegetationArea = farmArea.vegetationArea;
  }
}
