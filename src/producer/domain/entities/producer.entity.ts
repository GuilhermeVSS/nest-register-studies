import { CpfCnpj } from "../value-objects/cpf-cnpj.vo";
import { Name } from "../value-objects/name.vo";

export class Producer {
    private _id?: string;
    private _name: Name;
    private _cpfCnpj: CpfCnpj;

    constructor(params: {id?: string, name: Name, cpfCnpj: CpfCnpj}) {
        this._id = params.id;
        this._name  = params.name;
        this._cpfCnpj = params.cpfCnpj;
    }

    get name(): Name {
        return this._name;
    }
    
    get cpfCnpj(): CpfCnpj {
        return this._cpfCnpj;
    }

    get id(): string | undefined {
        return this._id;
    }

    set name(name: Name) {
        this._name = name;
    }

    set cpfCnpj(cpfCnpj: CpfCnpj) {
        this._cpfCnpj = cpfCnpj;
    }
}