import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import * as PlayerSelectors from '../player/player.selectors';

@Injectable()
export class PlayerFacade {
  players$ = this.store.pipe(select(PlayerSelectors.getAllPlayer));
  currentPlayerId$ = this.store.pipe(
    select(PlayerSelectors.getCurrentPlayerId)
  );
  currentPlayer$ = this.store.pipe(select(PlayerSelectors.getCurrentPlayer));

  constructor(private store: Store) {}
}
