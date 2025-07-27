import { StateRepository } from '../../domain/repositories/state.repository';

export interface ListStateOutput {
  id?: string;
  name?: string;
  uf?: string;
}

export class ListStateUseCase {
  constructor(private readonly stateRepository: StateRepository) {}

  async execute(): Promise<ListStateOutput[]> {
    const states = await this.stateRepository.list();
    return states.map((state) => ({
      id: state.id,
      name: state.name,
      uf: state.uf,
    }));
  }
}
