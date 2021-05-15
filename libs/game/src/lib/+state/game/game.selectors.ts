import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GAME_FEATURE_KEY, State, GamePartialState } from './game.reducer';

// Lookup the 'Game' feature state managed by NgRx
export const getGameState = createFeatureSelector<GamePartialState, State>(
  GAME_FEATURE_KEY
);

export const getGameLoaded = createSelector(
  getGameState,
  (state: State) => {
    return state.loaded;
  }
);

export const getGameError = createSelector(
  getGameState,
  (state: State) => state.error
);

export const getGameData = createSelector(
  getGameState,
  (state: State) => state.game
);
