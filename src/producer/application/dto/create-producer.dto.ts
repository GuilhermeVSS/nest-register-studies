import { IsString, Length, Matches } from 'class-validator';

export class CreateProducerDto {
    @IsString()
    @Length(3, 100, {message: 'Name must be between 3 and 100 characters long'})
    name: string;

    @IsString()
    @Matches(/^\d{11}|\d{14}$/, {message: 'CPF must be 11 digits or CNPJ must be 14 digits'})
    @Matches(/^\d+$/, {message: 'CPF/CNPJ must contain only digits'})
    cpfCnpj: string;
}
