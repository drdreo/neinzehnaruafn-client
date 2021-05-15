import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { GameEffects } from './game.effects';
import * as GameActions from './game.actions';

describe('GameEffects', () => {
  let actions: Observable<any>;
  let effects: GameEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        GameEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(GameEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: GameActions.init('demoCode') });

      const expected = hot('-a-|', {
        a: GameActions.loadGameSuccess({ game: {id: 'demoCode'}}),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
