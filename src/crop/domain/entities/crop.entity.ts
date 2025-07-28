export class Crop {
  private _id?: string;
  private _name: string;
  private _harvestId: string;

  constructor(params: { id?: string; name: string; harvestId: string }) {
    this._id = params.id;
    this._name = params.name;
    this._harvestId = params.harvestId;
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get harvestId(): string {
    return this._harvestId;
  }
}
