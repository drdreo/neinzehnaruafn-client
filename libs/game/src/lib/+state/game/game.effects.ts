import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as GameFeature from './game.reducer';
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
          return GameActions.loadGameSuccess({ game: {id: 'demoCode'} });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return GameActions.loadGameFailure({ error });
        },
      })
    )
  );

  constructor(private actions$: Actions) {}
}
