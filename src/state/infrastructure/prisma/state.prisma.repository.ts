import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { StateRepository } from '../../domain/repositories/state.repository';
import { State } from '../../domain/entities/state.entity';

@Injectable()
export class StatePrismaRepository implements StateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(): Promise<State[]> {
    const states = await this.prismaService.state.findMany();
    return states.map((state) => new State(state));
  }
}
