import { BadRequestException, ConflictException } from '@nestjs/common';
import { UpdateFarmUseCase } from './update-farm.use-case';
import { FarmRepository } from '../../domain/repositories/farm.repository';
import { Farm } from '../..//domain/entities/farm.entity';
import { FarmArea } from '../../domain/value-object/farm-area.vo';
import { Prisma } from '@prisma/client';

describe('UpdateFarmUseCase', () => {
  let useCase: UpdateFarmUseCase;
  let farmRepository: FarmRepository;

  beforeEach(() => {
    farmRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      findByNameAndProducerId: jest.fn(),
    } as FarmRepository;
    useCase = new UpdateFarmUseCase(farmRepository);
  });

  it('should update a farmm successfuly', async () => {
    const input = {
      name: 'Farm Test Update',
      city: 'City Test Update',
      totalArea: 7.5,
      vegetationArea: 5.5,
      arableArea: 2.0,
    };

    const existingFarm = new Farm({
      id: 'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8',
      name: 'Farm Test',
      city: 'City Test',
      stateId: 'a697d810-f71d-4e9e-aa4d-60560939caa3',
      producerId: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
      farmArea: FarmArea.create({
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      }) as FarmArea,
    });

    const updatedFarm = new Farm({
      id: 'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8',
      name: input.name,
      city: input.city,
      stateId: 'a697d810-f71d-4e9e-aa4d-60560939caa3',
      producerId: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
      farmArea: FarmArea.create({
        totalArea: input.totalArea,
        vegetationArea: input.vegetationArea,
        arableArea: input.arableArea,
      }) as FarmArea,
    });

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(existingFarm);
    jest.spyOn(farmRepository, 'update').mockResolvedValue(updatedFarm);

    const result = await useCase.execute(
      input,
      'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8',
    );

    expect(result).toEqual({
      id: updatedFarm.id,
      name: updatedFarm.name,
      city: updatedFarm.city,
      stateId: updatedFarm.stateId,
      producerId: updatedFarm.producerId,
      totalArea: updatedFarm.totalArea,
      vegetationArea: updatedFarm.vegetationArea,
      arableArea: updatedFarm.arableArea,
    });
  });

  it('should throw BadRequest due to sum of areas', async () => {
    const input = {
      name: 'Farm Test Update',
      city: 'City Test Update',
      totalArea: 7.5,
      vegetationArea: 4.5,
      arableArea: 2.0,
    };

    const existingFarm = new Farm({
      id: 'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8',
      name: 'Farm Test',
      city: 'City Test',
      stateId: 'a697d810-f71d-4e9e-aa4d-60560939caa3',
      producerId: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
      farmArea: FarmArea.create({
        totalArea: 5.5,
        vegetationArea: 3.5,
        arableArea: 2.0,
      }) as FarmArea,
    });

    const updatedFarm = new Farm({
      id: 'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8',
      name: input.name,
      city: input.city,
      stateId: 'a697d810-f71d-4e9e-aa4d-60560939caa3',
      producerId: 'fb9cc64f-a088-4c93-be42-2ec0d826050d',
      farmArea: FarmArea.create({
        totalArea: input.totalArea,
        vegetationArea: input.vegetationArea,
        arableArea: input.arableArea,
      }) as FarmArea,
    });

    jest.spyOn(farmRepository, 'findById').mockResolvedValue(existingFarm);
    jest.spyOn(farmRepository, 'update').mockResolvedValue(updatedFarm);

    await expect(
      useCase.execute(input, 'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictExceptio due conflict namme', async () => {
    const input = {
      name: 'Name Already Exists',
      city: 'City Test Update',
      totalArea: 7.5,
      vegetationArea: 5.5,
      arableArea: 2.0,
    };

    jest.spyOn(farmRepository, 'update').mockRejectedValue({
      code: 'P2002',
      clientVersion: Prisma.prismaVersion.client,
      meta: {
        target: ['producerId', 'name'],
      },
      name: 'PrismaClientKnownRequestError',
      message: 'Unique constraint failed on the fields: (`producerId`,`name`)',
    });

    await expect(
      useCase.execute(input, 'fbf6ec4d-06f2-4f92-b28f-33e7073f31a8'),
    ).rejects.toThrow(ConflictException);
  });
});
