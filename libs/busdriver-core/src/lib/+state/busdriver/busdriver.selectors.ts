import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  BUSDRIVER_FEATURE_KEY,
  State,
  BusdriverPartialState,
  playerAdapter
} from './busdriver.reducer';

// Lookup the 'Busdriver' feature state managed by NgRx
export const getBusdriverState = createFeatureSelector<
  BusdriverPartialState,
  State
>(BUSDRIVER_FEATURE_KEY);

const { selectAll, selectEntities } = playerAdapter.getSelectors();

export const getBusdriverLoaded = createSelector(
  getBusdriverState,
  (state: State) => state.loaded
);

export const getBusdriverError = createSelector(
  getBusdriverState,
  (state: State) => state.error
);

export const getAllPlayers = createSelector(
  getBusdriverState,
  (state: State) => selectAll(state)
);

export const getPlayerEntities = createSelector(
  getBusdriverState,
  (state: State) => selectEntities(state)
);

export const getCurrentPlayerId = createSelector(
  getBusdriverState,
  (state: State) => state.currentPlayerId
);

export const getCurrentPlayer = createSelector(
  getPlayerEntities,
  getCurrentPlayerId,
  (entities, currentId) => currentId && entities[currentId]
);
