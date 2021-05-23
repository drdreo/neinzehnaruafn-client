import { createAction, props } from '@ngrx/store';
import { PlayerEntity } from './busdriver.models';

export const leave = createAction('[Busdriver/API] Leave Game');
export const join = createAction('[Busdriver/API] Join', props<{ username: string, room: string }>());

export const joinBusdriverSuccess = createAction(
  '[Busdriver/API] Load Busdriver Success',
  props<{ players: PlayerEntity[], room: string, playerID: string }>()
);

export const joinBusdriverFailure = createAction(
  '[Busdriver/API] Load Busdriver Failure',
  props<{ error: any }>()
);

export const startGame = createAction('[Busdriver/API] Start Game');

export const playersUpdate = createAction(
  '[Busdriver/API] Players Update',
  props<{ players: PlayerEntity[] }>()
);
