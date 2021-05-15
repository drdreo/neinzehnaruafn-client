import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';
import { readFirst } from '@nrwl/angular/testing';

import * as GameActions from '../game/game.actions';
import { GameEffects } from '../game/game.effects';

import { GameEntity } from '../game/game.models';
import { GAME_FEATURE_KEY, State, reducer } from '../game/game.reducer';
import { GameFacade } from './game.facade';


interface GameSchema {
  game: State;
}

describe('GameFacade', () => {
  let facade: GameFacade;
  let store: Store<GameSchema>;
  const createGameEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${ id }`
    } as GameEntity);

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(GAME_FEATURE_KEY, reducer),
          EffectsModule.forFeature([GameEffects])
        ],
        providers: [GameFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule
        ]
      })
      class RootModule {}

      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(GameFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('init() should return empty list with loaded == true', async (done) => {
      try {
        let game = await readFirst(facade.game$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(game).toBeUndefined();
        expect(isLoaded).toBe(false);

        facade.init();

        game = await readFirst(facade.game$);
        isLoaded = await readFirst(facade.loaded$);

        expect(game).toBeDefined();
        expect(game.id).toBe('demoCode');
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadGameSuccess` to manually update list
     */
    it('game$ should return the game data; and loaded flag == true', async (done) => {
      try {
        let game = await readFirst(facade.game$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(game).toBeUndefined();
        expect(isLoaded).toBe(false);

        store.dispatch(
          GameActions.loadGameSuccess({
            game: createGameEntity('AAA')
          })
        );

        game = await readFirst(facade.game$);
        isLoaded = await readFirst(facade.loaded$);

        expect(game).toBeDefined();
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
