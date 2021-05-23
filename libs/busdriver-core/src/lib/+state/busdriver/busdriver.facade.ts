import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as BusdriverActions from './busdriver.actions';
import * as BusdriverSelectors from './busdriver.selectors';

@Injectable()
export class BusdriverFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(BusdriverSelectors.getBusdriverLoaded));
  error$ = this.store.pipe(select(BusdriverSelectors.getBusdriverError));
  allPlayers$ = this.store.pipe(select(BusdriverSelectors.getAllPlayers));
  currentPlayer$ = this.store.pipe(select(BusdriverSelectors.getCurrentPlayer));

  constructor(private store: Store) {}

  join(username: string, room: string) {
    this.store.dispatch(BusdriverActions.join({ username, room }));
  }

  leave() {
    this.store.dispatch(BusdriverActions.leave());
  }

  startGame() {
    this.store.dispatch(BusdriverActions.startGame());
  }

  updatePlayers(players: []) {
    this.store.dispatch(BusdriverActions.playersUpdate({ players }));
  }
}
