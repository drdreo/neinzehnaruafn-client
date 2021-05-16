import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GameEffects } from './+state/game/game.effects';
import { GameFacade } from './+state/game/game.facade';
import * as fromGame from './+state/game/game.reducer';
import { PlayerEffects } from './+state/player/player.effects';
import { PlayerFacade } from './+state/player/player.facade';
import * as fromPlayer from './+state/player/player.reducer';
import { GameService } from './game.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(fromGame.GAME_FEATURE_KEY, fromGame.reducer),
    EffectsModule.forFeature([GameEffects]),
    StoreModule.forFeature(fromPlayer.PLAYER_FEATURE_KEY, fromPlayer.reducer),
    EffectsModule.forFeature([PlayerEffects])
  ],
  providers: [GameFacade, PlayerFacade, GameService]
})
export class GameModule {}
