import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';
import { HttpService } from '../../http.service';
import { SocketService } from '../../socket.service';
import * as BusdriverActions from './busdriver.actions';

@Injectable()
export class BusdriverEffects {

  leave$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BusdriverActions.leave),
        tap(() => this.socketService.leave())
      ),
    { dispatch: false }
  );

  join$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusdriverActions.join),
      fetch({
        run: (action) => {

          // Your custom service 'load' logic goes here. For now just return a success action...
          return this.httpService.joinRoom(action.username, action.room, this.socketService.getSocketId())
                     .pipe(map((response) => (BusdriverActions.joinBusdriverSuccess({
                       players: response.players,
                       room: response.room,
                       playerID: response.playerID
                     }))));
        },
        onError: (action, error) => {
          console.error('Error', error);
          return BusdriverActions.joinBusdriverFailure({ error });
        }
      })
    )
  );

  joinBusdriverSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BusdriverActions.joinBusdriverSuccess),
        tap(({ playerID }) => sessionStorage.setItem('playerID', playerID)),
        tap(({ room }) => this.router.navigate(['room', room]))
      ),
    { dispatch: false }
  );


  startGame$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BusdriverActions.startGame),
        tap(() => this.socketService.startGame())
      ),
    { dispatch: false }
  );

  guess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BusdriverActions.guess),
        tap((action) => this.socketService.guess(action.guess))
      ),
    { dispatch: false }
  );

  guessResponse$ = createEffect(() =>
    this.socketService.onGuess()
        .pipe(map((message) => BusdriverActions.guessResponse({ message })))
  );


  playersUpdate$ = createEffect(() =>
    this.socketService.onPlayersUpdate()
        .pipe(map((players) => BusdriverActions.playersUpdate({ players })))
  );

  pyramidUpdate$ = createEffect(() =>
    this.socketService.onPyramidUpdate()
        .pipe(map((pyramid) => BusdriverActions.pyramidUpdate({ pyramid })))
  );

  guessesUpdate$ = createEffect(() =>
    this.socketService.onGuessesUpdate()
        .pipe(map((guesses) => BusdriverActions.guessesUpdate({ guesses })))
  );

  constructor(private actions$: Actions, private router: Router, private httpService: HttpService, private socketService: SocketService) {}
}
