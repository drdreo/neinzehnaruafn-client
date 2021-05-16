import { Injectable } from '@angular/core';
import { createEffect, Actions } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { GameService } from '../../game.service';
import * as PlayerActions from '../player/player.actions';

@Injectable()
export class PlayerEffects {
  players$ = createEffect(() =>
    this.gameService.playersUpdated$.pipe(
      map(players => PlayerActions.playersUpdated({ players }))
    )
  );

  currentPlayerId$ = createEffect(() =>
    this.gameService.currentPlayerUpdated$.pipe(
      map(playerId => PlayerActions.currentPlayerUpdated({ playerId }))
    )
  );

  constructor(private actions$: Actions, private gameService: GameService) {}
}
