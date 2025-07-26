import { Producer } from "../entities/producer.entity";

export interface ProducerRepository {
    save(producer: Producer): Promise<Producer | Error>;
    findByCpfCnpj(cpfCnpj: string): Promise<Producer | null>;
}