import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as PlayerActions from './player.actions';
import { PlayerEntity } from './player.models';

export const PLAYER_FEATURE_KEY = 'players';

export interface PlayerState extends EntityState<PlayerEntity> {
  currentPlayerId?: string;
}

export interface PlayerPartialState {
  readonly [PLAYER_FEATURE_KEY]: PlayerState;
}

export const playerAdapter: EntityAdapter<PlayerEntity> = createEntityAdapter<PlayerEntity>();

export const initialState: PlayerState = playerAdapter.getInitialState({
  // set initial required properties
});

const playerReducer = createReducer(
  initialState,
  on(PlayerActions.playersUpdated, (state, { players }) =>
    playerAdapter.setAll(players, { ...state })
  ),
  on(PlayerActions.currentPlayerUpdated, (state, { playerId }) => ({
    ...state,
    currentPlayerId: playerId
  }))
);

export function reducer(state: PlayerState | undefined, action: Action) {
  return playerReducer(state, action);
}
