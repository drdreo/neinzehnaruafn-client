interface Card {
  figure: string;
  value: string;
  shown: boolean;
}

export class Game {

  pyramid: Card[][] = [];
  deck: Card[] = [];
  currentPosition = [0, 0];

  constructor() {
    this.fillDeck();
    this.fillDeck();
    this.initPyramid();
  }

  fillDeck() {
    const figures = ['S', 'H', 'D', 'C'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    figures.forEach((figure) => {
      values.forEach(value => {
        this.deck.push({ value, figure, shown: false });
      });
    });

    // shuffle the deck array with Fisher-Yates
    for (let i = 0; i < this.deck.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = tmp;
    }
  }

  turnCard(row, column) {
    this.pyramid[row][column].shown = true;
  }

  turnCurrentCard() {
    const [row, column] = this.currentPosition;
    this.turnCard(row, column);

    if(this.hasCardsLeft()){
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

  private isCurrentPositionACard() {
    const [row, column] = this.currentPosition;
    return !!this.pyramid[row][column];
  }

  initPyramid(size = 4) {
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
        return { value: 'X', figure: 'X' };
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

  private hasCardsLeft() {
    return this.pyramid[this.pyramid.length-1].some(card => !card.shown);
  }
}
