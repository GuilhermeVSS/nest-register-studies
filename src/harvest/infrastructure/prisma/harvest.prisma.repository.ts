import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { HarvestRepository } from '../../domain/repositories/harvest.repository';
import { Harvest } from '../../domain/entities/harvest.entity';

@Injectable()
export class HarvestPrismaRepository implements HarvestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(harvest: Harvest): Promise<Harvest | Error> {
    const data = await this.prismaService.harvest.create({
      data: {
        id: harvest.id,
        name: harvest.name,
        year: harvest.year,
        farmId: harvest.farmId,
      },
    });

    return new Harvest({
      id: data.id,
      name: data.name,
      year: data.year,
      farmId: data.farmId,
    });
  }

  async findById(id: string): Promise<Harvest | null> {
    const data = await this.prismaService.harvest.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Harvest({
      id: data.id,
      name: data.name,
      year: data.year,
      farmId: data.farmId,
    });
  }

  async update(harvest: Harvest): Promise<Harvest> {
    const data = await this.prismaService.harvest.update({
      where: { id: harvest.id },
      data: {
        id: harvest.id,
        name: harvest.name,
        year: harvest.year,
        farmId: harvest.farmId,
      },
    });

    return new Harvest({
      id: data.id,
      name: data.name,
      year: data.year,
      farmId: data.farmId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.harvest.delete({ where: { id } });
  }

  async list(): Promise<Harvest[]> {
    const data = await this.prismaService.harvest.findMany();

    return data.map((item) => {
      return new Harvest({
        id: item.id,
        name: item.name,
        year: item.year,
        farmId: item.farmId,
      });
    });
  }
}
