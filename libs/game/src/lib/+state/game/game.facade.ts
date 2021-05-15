import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as GameActions from '../game/game.actions';
import * as GameSelectors from '../game/game.selectors';

@Injectable()
export class GameFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(GameSelectors.getGameLoaded));
  error$ = this.store.pipe(select(GameSelectors.getGameError));
  game$ = this.store.pipe(select(GameSelectors.getGameData));

  constructor(private store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init(room: string) {
    this.store.dispatch(GameActions.init(room));
  }
}
