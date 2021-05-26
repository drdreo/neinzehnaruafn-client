export interface Card {
  figure: string;
  value: string;
  shown: boolean;
}

export enum CardType {
  Clubs = 'C',
  Diamond = 'D',
  Heart = 'H',
  Spades = 'S',
}

export function createDeck(): Card[] {
  const deck = [];
  const figures = [CardType.Clubs, CardType.Diamond, CardType.Heart, CardType.Spades];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  figures.forEach((figure) => {
    values.forEach(value => {
      deck.push({ value, figure, shown: false });
    });
  });

  // shuffle the deck array with Fisher-Yates
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  return deck;
}

export type ColorGuess = 'red' | 'black';
export type ValueGuess = 'higher' | 'lower' | 'equal';
export type PositionGuess = 'inside' | 'outside' | 'equal';
export type FigureGuess = 'have' | 'miss';
export type Guess = ColorGuess | ValueGuess | PositionGuess | FigureGuess;
