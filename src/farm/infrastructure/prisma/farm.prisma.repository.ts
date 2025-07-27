import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmArea } from '../../domain/value-object/farm-area.vo';

@Injectable()
export class FarmPrismaRepository implements FarmRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(farm: Farm): Promise<Farm | Error> {
    const data = await this.prismaService.farm.create({
      data: {
        id: farm.id,
        name: farm.name,
        city: farm.city,
        stateId: farm.stateId,
        producerId: farm.producerId,
        totalArea: farm.totalArea,
        vegetationArea: farm.vegetationArea,
        arableArea: farm.arableArea,
      },
    });

    return new Farm({
      id: data.id,
      name: data.name,
      city: data.city,
      stateId: data.stateId,
      producerId: data.producerId,
      farmArea: FarmArea.create({
        totalArea: data.totalArea,
        vegetationArea: data.vegetationArea,
        arableArea: data.arableArea,
      }) as FarmArea,
    });
  }

  async findById(id: string): Promise<Farm | null> {
    const data = await this.prismaService.farm.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Farm({
      id: data.id,
      name: data.name,
      city: data.city,
      stateId: data.stateId,
      producerId: data.producerId,
      farmArea: FarmArea.create({
        totalArea: data.totalArea,
        vegetationArea: data.vegetationArea,
        arableArea: data.arableArea,
      }) as FarmArea,
    });
  }

  async update(farm: Farm): Promise<Farm> {
    const data = await this.prismaService.farm.update({
      where: { id: farm.id },
      data: {
        name: farm.name,
        city: farm.city,
        stateId: farm.stateId,
        producerId: farm.producerId,
        totalArea: farm.totalArea,
        vegetationArea: farm.vegetationArea,
        arableArea: farm.arableArea,
      },
    });

    return new Farm({
      id: data.id,
      name: data.name,
      city: data.city,
      stateId: data.stateId,
      producerId: data.producerId,
      farmArea: FarmArea.create({
        totalArea: data.totalArea,
        vegetationArea: data.vegetationArea,
        arableArea: data.arableArea,
      }) as FarmArea,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.farm.delete({ where: { id } });
  }

  async list(): Promise<Farm[]> {
    const data = await this.prismaService.farm.findMany();

    return data.map((item) => {
      return new Farm({
        id: item.id,
        name: item.name,
        city: item.city,
        stateId: item.stateId,
        producerId: item.producerId,
        farmArea: FarmArea.create({
          totalArea: item.totalArea,
          vegetationArea: item.vegetationArea,
          arableArea: item.arableArea,
        }) as FarmArea,
      });
    });
  }

  async findByNameAndProducerId(
    name: string,
    producerId: string,
  ): Promise<Farm | null> {
    const data = await this.prismaService.farm.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        producerId: producerId,
      },
    });

    if (!data) return null;

    return new Farm({
      id: data.id,
      name: data.name,
      city: data.city,
      stateId: data.stateId,
      producerId: data.producerId,
      farmArea: FarmArea.create({
        totalArea: data.totalArea,
        vegetationArea: data.vegetationArea,
        arableArea: data.arableArea,
      }) as FarmArea,
    });
  }
}
