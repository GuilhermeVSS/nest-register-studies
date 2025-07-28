export class Harvest {
  private _id?: string;
  private _name: string;
  private _year: number;
  private _farmId: string;

  constructor(params: {
    id?: string;
    name: string;
    year: number;
    farmId: string;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._year = params.year;
    this._farmId = params.farmId;
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

  get year(): number {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
  }

  get farmId(): string {
    return this._farmId;
  }
}
