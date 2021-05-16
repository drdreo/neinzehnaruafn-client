import { createAction, props } from '@ngrx/store';
import { PlayerEntity } from './player.models';

export const playersUpdated = createAction(
  '[Player/API] Players Update',
  props<{ players: PlayerEntity[] }>()
);

export const currentPlayerUpdated = createAction(
  '[Player/API] CurrentPlayer Update',
  props<{ playerId: string }>()
);
