import { State } from '../entities/state.entity';

export interface StateRepository {
  list(): Promise<State[]>;
}
