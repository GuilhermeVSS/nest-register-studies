import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProducerRepository } from '../../domain/repositories/producer.repository';
import { Producer } from '../../domain/entities/producer.entity';
import { CpfCnpj } from '../../domain/value-objects/cpf-cnpj.vo';
import { Name } from '../../domain/value-objects/name.vo';

@Injectable()
export class ProducerPrismaRepository implements ProducerRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async save(producer: Producer): Promise<Producer | Error> {
    const data = await this.prismaService.producer.create({
      data: {
        id: producer.id,
        name: producer.name.value,
        cpfCnpj: producer.cpfCnpj.value,
      },
    });

    return new Producer({
      id: data.id,
      name: Name.create(data.name) as Name,
      cpfCnpj: CpfCnpj.create(data.cpfCnpj) as CpfCnpj,
    });
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Producer | null> {
    const data = await this.prismaService.producer.findUnique({
      where: {
        cpfCnpj,
      },
    });

    if (!data) {
      return null;
    }

    return new Producer({
      id: data.id,
      name: Name.create(data.name) as Name,
      cpfCnpj: CpfCnpj.create(data.cpfCnpj) as CpfCnpj,
    });
  }

  async findById(id: string): Promise<Producer | null> {
    const data = await this.prismaService.producer.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Producer({
      id: data.id,
      name: Name.create(data.name) as Name,
      cpfCnpj: CpfCnpj.create(data.cpfCnpj) as CpfCnpj,
    });
  }

  async update(producer: Producer): Promise<Producer> {
    const data = await this.prismaService.producer.update({
      where: { id: producer.id },
      data: {
        name: producer.name.value,
        cpfCnpj: producer.cpfCnpj.value,
      },
    });

    return new Producer({
      id: data.id,
      name: Name.create(data.name) as Name,
      cpfCnpj: CpfCnpj.create(data.cpfCnpj) as CpfCnpj,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.producer.delete({ where: { id } });
  }

  async list(): Promise<Producer[]> {
    const data = await this.prismaService.producer.findMany();

    return data.map((item) => {
      return new Producer({
        id: item.id,
        name: Name.create(item.name) as Name,
        cpfCnpj: CpfCnpj.create(item.cpfCnpj) as CpfCnpj,
      });
    });
  }
}
