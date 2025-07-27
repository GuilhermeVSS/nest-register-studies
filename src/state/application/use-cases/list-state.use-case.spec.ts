import { ListStateUseCase } from './list-state.use-case';
import { StateRepository } from '../../domain/repositories/state.repository';
import { State } from '../../domain/entities/state.entity';

describe('ListStateUseCase', () => {
  let useCase: ListStateUseCase;
  let stateRepository: StateRepository;

  beforeEach(() => {
    stateRepository = {
      list: jest.fn(),
    } as StateRepository;
    useCase = new ListStateUseCase(stateRepository);
  });

  it('should return a list of states', async () => {
    const states = [
      {
        id: 'b6cd03ee-491d-44bb-925e-3bb56dd395d9',
        name: 'State A',
        uf: 'SA',
      },
      {
        id: 'a3f337dd-655d-4710-b7fe-0908643cec86',
        name: 'State B',
        uf: 'SB',
      },
    ];

    jest
      .spyOn(stateRepository, 'list')
      .mockResolvedValue(states.map((state) => new State(state)));

    const result = await useCase.execute();

    expect(result).toEqual(states);
  });
});
