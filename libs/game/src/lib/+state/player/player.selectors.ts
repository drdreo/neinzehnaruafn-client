import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PLAYER_FEATURE_KEY, PlayerState, PlayerPartialState, playerAdapter } from './player.reducer';

// Lookup the 'Player' feature state managed by NgRx
export const getPlayerState = createFeatureSelector<PlayerPartialState,
  PlayerState>(PLAYER_FEATURE_KEY);

const { selectAll, selectEntities } = playerAdapter.getSelectors();

export const getAllPlayer = createSelector(
  getPlayerState,
  (state: PlayerState) => selectAll(state)
);

export const getPlayerEntities = createSelector(
  getPlayerState,
  (state: PlayerState) => selectEntities(state)
);

export const getCurrentPlayerId = createSelector(
  getPlayerState,
  (state: PlayerState) => state.currentPlayerId
);

export const getCurrentPlayer = createSelector(
  getPlayerEntities,
  getCurrentPlayerId,
  (entities, currentPlayerId) => currentPlayerId && entities[currentPlayerId]
);
