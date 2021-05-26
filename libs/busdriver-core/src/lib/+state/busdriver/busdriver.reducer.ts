import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { Card, Guess } from '../../card';
import * as BusdriverActions from './busdriver.actions';
import { PlayerEntity } from './busdriver.models';

export const BUSDRIVER_FEATURE_KEY = 'busdriver';

export interface State extends EntityState<PlayerEntity> {
  currentPlayerId?: string; // which player record is the current
  loaded: boolean; // has the Busdriver data been loaded
  room?: string
  error?: Error | string | null; // last known error (if any)
  pyramid?: Card[][];
  guesses?: Guess[]
  message?: string;
}

export interface BusdriverPartialState {
  readonly [BUSDRIVER_FEATURE_KEY]: State;
}

export const playerAdapter: EntityAdapter<PlayerEntity> = createEntityAdapter<PlayerEntity>();

export const initialState: State = playerAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const busdriverReducer = createReducer(
  initialState,
  on(BusdriverActions.join, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(BusdriverActions.joinBusdriverSuccess, (state, { players, room }) =>
    playerAdapter.setAll(players, { ...state, loaded: true, room })
  ),
  on(BusdriverActions.joinBusdriverFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(BusdriverActions.playersUpdate, (state, { players }) =>
    playerAdapter.setAll(players, { ...state })
  ),
  on(BusdriverActions.pyramidUpdate, (state, { pyramid }) => ({
    ...state,
    pyramid
  })),
  on(BusdriverActions.guessesUpdate, (state, { guesses }) => ({
    ...state,
    guesses
  })),
  on(BusdriverActions.guessResponse, (state, { message }) => ({
    ...state,
    message
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return busdriverReducer(state, action);
}
