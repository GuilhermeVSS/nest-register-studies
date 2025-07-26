export class Name {
  private readonly _name: string;

  constructor(name: string) {
    this._name = name;
  }

  static isValid(value: string): boolean {
    return value.length >= 3 && value.length <= 100;
  }

  static create(name: string): Name | Error {
    if (this.isValid(name)) {
      return new Name(name);
    }
    return new Error('Invalid name');
  }

  get value(): string {
    return this._name;
  }
}