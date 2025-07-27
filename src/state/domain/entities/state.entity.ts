export class State {
  _id: string;
  _name: string;
  _uf: string;

  constructor(params: { id: string; name: string; uf: string }) {
    this._id = params.id;
    this._name = params.name;
    this._uf = params.uf;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get uf(): string {
    return this._uf;
  }
}
