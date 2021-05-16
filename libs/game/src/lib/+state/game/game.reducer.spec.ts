import * as GameActions from './game.actions';
import { GameEntity } from './game.models';
import { GameState, initialState, reducer } from './game.reducer';

describe('Game Reducer', () => {
  const createGameEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${ id }`
    } as GameEntity);

  describe('valid Game actions', () => {
    it('loadGameSuccess should return set the list of known Game', () => {
      const game = createGameEntity('GAME-AAA');
      const action = GameActions.loadGameSuccess({ game });

      const result: GameState = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.game).toBeDefined();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
