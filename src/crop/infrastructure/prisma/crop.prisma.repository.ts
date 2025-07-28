import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CropRepository } from '../../domain/repositories/crop.repository';
import { Crop } from '../../domain/entities/crop.entity';

@Injectable()
export class CropPrismaRepository implements CropRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async save(harvest: Crop): Promise<Crop | Error> {
    const data = await this.prismaService.crop.create({
      data: {
        id: harvest.id,
        name: harvest.name,

        harvestId: harvest.harvestId,
      },
    });

    return new Crop({
      id: data.id,
      name: data.name,
      harvestId: data.harvestId,
    });
  }

  async findById(id: string): Promise<Crop | null> {
    const data = await this.prismaService.crop.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Crop({
      id: data.id,
      name: data.name,
      harvestId: data.harvestId,
    });
  }

  async update(harvest: Crop): Promise<Crop> {
    const data = await this.prismaService.crop.update({
      where: { id: harvest.id },
      data: {
        id: harvest.id,
        name: harvest.name,
        harvestId: harvest.harvestId,
      },
    });

    return new Crop({
      id: data.id,
      name: data.name,
      harvestId: data.harvestId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.crop.delete({ where: { id } });
  }

  async list(): Promise<Crop[]> {
    const data = await this.prismaService.crop.findMany();

    return data.map((item) => {
      return new Crop({
        id: item.id,
        name: item.name,
        harvestId: item.harvestId,
      });
    });
  }
}
