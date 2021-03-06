import { createAction, props } from '@ngrx/store';
import { Card, Guess } from '../../card';
import { PlayerEntity } from './busdriver.models';

export const leave = createAction('[Busdriver/API] Player Leave');
export const join = createAction('[Busdriver/API] Player Join', props<{ username: string, room: string }>());
export const guess = createAction('[Busdriver/API] Player Guess', props<{ guess: Guess }>());


export const guessResponse = createAction(
  '[Busdriver/API] Guess Response',
  props<{ message: string }>()
);


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

export const pyramidUpdate = createAction(
  '[Busdriver/API] Pyramid Update',
  props<{ pyramid: Card[][] }>()
);

export const guessesUpdate = createAction(
  '[Busdriver/API] Guesses Update',
  props<{ guesses: Guess[] }>()
);
