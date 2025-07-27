import { StateController } from './state.controller';
import { StatePrismaRepository } from '../../infrastructure/prisma/state.prisma.repository';
import { PrismaService } from 'prisma/prisma.service';

describe('StateController', () => {
  let controller: StateController;
  let stateRepository: StatePrismaRepository;

  beforeEach(() => {
    class MockStatePrismaRepository extends StatePrismaRepository {
      save = jest.fn();
      findByCpfCnpj = jest.fn();
      findById = jest.fn();
      update = jest.fn();
      delete = jest.fn();
      list = jest.fn();
    }
    stateRepository = new MockStatePrismaRepository({} as PrismaService);
    controller = new StateController(stateRepository);
  });

  describe('findAll', () => {
    it('should return a list of states successfully', async () => {
      (stateRepository.list as jest.Mock).mockResolvedValue([
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
      ]);

      const result = await controller.findAll();

      expect(result).toEqual([
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
      ]);
    });
  });
});
