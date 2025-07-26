import { cpf, cnpj } from 'cpf-cnpj-validator';

export class CpfCnpj {
  private readonly _value: string;

  constructor(cpfCnpj: string) {
    this._value = cpfCnpj;
  }

  static isValid(value: string): boolean {
    return cpf.isValid(value) || cnpj.isValid(value);
  }

  static create(cpfCnpj: string): CpfCnpj | Error {
    if (this.isValid(cpfCnpj)) {
      return new CpfCnpj(cpfCnpj);
    }
    return new Error('Invalid CPF or CNPJ');
  }

  get value(): string {
    return this._value;
  }
}
