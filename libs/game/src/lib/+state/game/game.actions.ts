import { createAction, props } from '@ngrx/store';
import { GameEntity } from './game.models';

export const init = createAction(
  '[Game Page] Init',
  (room: string) => ({ room })
);

export const loadGame = createAction(
  '[Game/API] Load Game',
  props<{ playerName: string, room: string }>()
);

export const loadGameSuccess = createAction(
  '[Game/API] Load Game Success',
  props<{ game: GameEntity }>()
);

export const loadGameFailure = createAction(
  '[Game/API] Load Game Failure',
  props<{ error: any }>()
);
