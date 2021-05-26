import { Card, createDeck, Guess, ColorGuess, ValueGuess, PositionGuess, FigureGuess } from '@trial-nerror/busdriver-core';

export class Game {

  pyramid: Card[][] = [];
  deck: Card[] = [];
  currentPosition = [0, 0];

  constructor() {
    this.pushDeck();
    this.pushDeck();
    this.initPyramid();
  }

  private hasCardsLeft() {
    return this.pyramid[this.pyramid.length - 1].some(card => !card.shown);
  }

  private pushDeck() {
    this.deck.push(...createDeck());
  }

  private isCurrentPositionACard() {
    const [row, column] = this.currentPosition;
    return !!this.pyramid[row][column];
  }

  getCard(row: number, column: number): Card | undefined {
    return this.pyramid[row][column];
  }

  getCurrentCard(): Card {
    const [row, column] = this.currentPosition;
    return this.getCard(row, column);
  }

  getCurrentRow(): number {
    const [row] = this.currentPosition;
    return row;
  }

  turnCurrentCard() {
    this.getCurrentCard().shown = true;

    if (this.hasCardsLeft()) {
      this.nextPosition();
    }
  }

  nextPosition() {
    do {
      const [row, column] = this.currentPosition;
      // is end of row?
      if (column >= this.pyramid[0].length - 1) {
        this.currentPosition = [row + 1, 0];
      } else {
        this.currentPosition = [row, column + 1];
      }
    } while (!this.isCurrentPositionACard());
  }

  private initPyramid(size = 4) {
    const columns = size * 2 - 1;

    // init matrix
    for (let i = 0; i < size; i++) {
      this.pyramid[i] = Array(columns);
    }

    for (let row = 0; row < size; row++) {
      const space = row;

      for (let column = 0; column < columns; column++) {
        if (column - space >= 0 && column + space < columns) {
          this.pyramid[row][column] = this.deck.pop();
        }
      }
    }
  }

  getPyramid() {
    return this.pyramid.map(row => row.map(entry => {
      if (entry) {
        if (entry.shown) {
          return entry;
        }
        return { value: 'X', figure: 'back' };
      }
      return undefined;
    }));
  }

  printPyramid() {
    const pyramid = this.getPyramid();

    for (let i = pyramid.length - 1; i >= 0; i--) {
      let output = '';
      for (let j = 0; j < pyramid[i].length; j++) {
        const entry = pyramid[i][j];
        if (entry) {
          output += (entry.value + entry.figure).padStart(3, ' ');
        } else {
          output += '[ ]';
        }
        output += ' ';
      }
      console.log(output);
    }
  }

  getGuesses(): Guess[] {
    const row = this.getCurrentRow();
    switch (row) {
      case 0:
        return ['red', 'black'] as ColorGuess[];
      case 1:
        return ['higher', 'lower'] as ValueGuess[];
      case 2:
        return ['inside', 'outside', 'equal'] as PositionGuess[];
      case 3:
        return ['have', 'miss'] as FigureGuess[];
      default:
        return ['red', 'black'] as ColorGuess[];
    }

  }
}
