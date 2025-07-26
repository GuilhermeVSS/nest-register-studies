import { BadRequestException } from "@nestjs/common";
import { CreateProducerUseCase } from "./create-producer.use-case";
import { ProducerRepository} from "../../domain/repositories/producer.repository";
import { Producer } from "../../domain/entities/producer.entity";
import { CpfCnpj } from "../../domain/value-objects/cpf-cnpj.vo";
import { Name } from "../../domain/value-objects/name.vo";

describe("CreateProducerUseCase", () => {
    let useCase: CreateProducerUseCase;
    let producerRepository: ProducerRepository;

    beforeEach(() => {
        producerRepository = {
            save: jest.fn(),
            findByCpfCnpj: jest.fn(),
        } as any; 
        useCase = new CreateProducerUseCase(producerRepository);
    });

    it("should create a producer successfully", async () => {
        const input = { name: "User Name", cpfCnpj: "31101816066" };

        const mockProducer = new Producer({
            id: "1",
            name: Name.create(input.name) as Name,
            cpfCnpj: CpfCnpj.create(input.cpfCnpj) as CpfCnpj,
        });

        jest.spyOn(producerRepository, "findByCpfCnpj").mockResolvedValue(null);
        jest.spyOn(producerRepository, "save").mockResolvedValue(mockProducer);

        const result = await useCase.execute(input);

        expect(result).toEqual({
            id: mockProducer.id,
            name: mockProducer.name.value,
            cpfCnpj: mockProducer.cpfCnpj.value,
        });
    });

    it("should throw BadRequestException if CPF/CNPJ is invalid", async () => {
        const input = { name: "User Name", cpfCnpj: "invalid-cpf" };

        await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if name is invalid", async () => {
        const input = { name: "", cpfCnpj: "31101816066" };

        await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if producer already exists", async () => {
        const input = { name: "User Name", cpfCnpj: "31101816066" };
        
        jest.spyOn(producerRepository, "findByCpfCnpj").mockResolvedValue({
            id: "1",
            name: { value: input.name },
            cpfCnpj: { value: input.cpfCnpj },
        } as any);

        await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    });
});