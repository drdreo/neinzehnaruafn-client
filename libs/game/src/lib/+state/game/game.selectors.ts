import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GAME_FEATURE_KEY, GameState, GamePartialState } from './game.reducer';

// Lookup the 'Game' feature state managed by NgRx
export const getGameState = createFeatureSelector<GamePartialState, GameState>(
  GAME_FEATURE_KEY
);

export const getGameLoaded = createSelector(
  getGameState,
  (state: GameState) => {
    return state.loaded;
  }
);

export const getGameError = createSelector(
  getGameState,
  (state: GameState) => state.error
);

export const getGameData = createSelector(
  getGameState,
  (state: GameState) => state.game
);
