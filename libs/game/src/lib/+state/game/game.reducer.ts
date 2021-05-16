import { createReducer, on, Action } from '@ngrx/store';

import * as GameActions from './game.actions';
import { GameEntity } from './game.models';

export const GAME_FEATURE_KEY = 'game';

export interface GameState {
  loaded: boolean; // has the Game been loaded
  game?: GameEntity;
  error?: string | null; // last known error (if any)
}

export interface GamePartialState {
  readonly [GAME_FEATURE_KEY]: GameState;
}

// export const gameAdapter: EntityAdapter<GameEntity> = createEntityAdapter<GameEntity>();

export const initialState: GameState = {
  // set initial required properties
  loaded: false
};

const gameReducer = createReducer(
  initialState,
  on(GameActions.init, (state) => ({ ...state, loaded: false })),
  on(GameActions.loadGameSuccess, (state, { game }) => ({ ...state, loaded: true, error: null, game })),
  on(GameActions.loadGameFailure, (state, { error }) => ({ ...state, error })),
);

export function reducer(state: GameState | undefined, action: Action) {
  return gameReducer(state, action);
}
