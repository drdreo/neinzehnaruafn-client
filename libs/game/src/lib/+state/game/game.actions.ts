import { createAction, props } from '@ngrx/store';
import { GameEntity } from './game.models';

export const init = createAction('[Game Page] Init');

export const loadGameSuccess = createAction(
  '[Game/API] Load Game Success',
  props<{ game: GameEntity }>()
);

export const loadGameFailure = createAction(
  '[Game/API] Load Game Failure',
  props<{ error: any }>()
);
