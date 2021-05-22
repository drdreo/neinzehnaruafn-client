import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { tap, map } from 'rxjs/operators';
import { GameService } from '../../game.service';
import * as GameActions from './game.actions';

@Injectable()
export class GameEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.init),
      fetch({
        run: (action) => {
          // return this.socket.getGame().pipe(
          //   map(response => GameActions.loadGameSuccess({ game: response.game }))
          // );
          // Your custom service 'load' logic goes here. For now just return a success action...
          return GameActions.loadGameSuccess({ game: { id: action.room } });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return GameActions.loadGameFailure({ error });
        },
      })
    )
  );

  loadGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.loadGame),
      fetch({
        run: (action) => {
          return this.gameService
            .loadGame(action.playerName, action.room)
            .pipe(map((game) => GameActions.loadGameSuccess({ game })));
        },
        onError: (action, error) => {
          console.error('Error', error);
          return GameActions.loadGameFailure({ error });
        },
      })
    )
  );

  // gameLoadSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(GameActions.loadGameSuccess),
  //     tap(({ game }) => this.router.navigate(['room', game.id]))
  //   )
  // );

  constructor(
    private router: Router,
    private actions$: Actions,
    private gameService: GameService
  ) {}
}
