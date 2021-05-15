import { GameEntity } from './game.models';
import { initialState } from './game.reducer';
import * as GameSelectors from './game.selectors';

describe('Game Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const createGameEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${ id }`
    } as GameEntity);

  let state;

  beforeEach(() => {
    state = {
      game: {
        ...initialState,
        game: createGameEntity('GAME-AAA'),
        error: ERROR_MSG,
        loaded: true
      }
    };
  });

  describe('Game Selectors', () => {


    it('getGameData() should return the game data', () => {
      const result = GameSelectors.getGameData(state);
      expect(result.id).toBe('GAME-AAA');
    });

    it('getGameLoaded() should return the current \'loaded\' status', () => {
      const result = GameSelectors.getGameLoaded(state);

      expect(result).toBe(true);
    });

    it('getGameError() should return the current \'error\' state', () => {
      const result = GameSelectors.getGameError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
