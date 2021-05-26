import { Logger } from '@nestjs/common';
import { Card, CardType, Guess, ColorGuess, ValueGuess, PositionGuess, FigureGuess } from '@trial-nerror/busdriver-core';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './game';
import { Player } from './player';

export class Room {
  players: Player[] = [];
  playersQueue = new Queue<Player>();
  private game?: Game;

  constructor(public name: string) {
  }

  private resetRoom() {
    this.game = null;
    this.players.map(player => player.reset());
  }

  private enqueuePlayers() {
    this.playersQueue.enqueue(this.players);
  }

  addPlayer(username: string): string {
    const id = uuidv4();
    this.players.push(new Player(id, username));
    return id;
  }

  removePlayer(player: Player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  setCurrentPlayer(current: boolean) {
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.current = current;
  }

  nextPlayer() {
    this.setCurrentPlayer(false);

    this.playersQueue.dequeue();

    if (this.playersQueue.size() === 0) {
      this.enqueuePlayers();
    }

    this.setCurrentPlayer(true);
  }

  getPlayer(playerID: string) {
    return this.players.find(p => p.id === playerID);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getCurrentPlayer(): Player {
    return this.playersQueue.current();
  }

  getGame(): Game {
    return this.game;
  }

  hasGame(): boolean {
    return !!this.game;
  }

  startGame() {
    if (this.players.length < 1) {
      throw new Error('Cant start game. Too less players are in.');
    }

    this.resetRoom();
    this.newGame();
    this.enqueuePlayers();
    this.setCurrentPlayer(true);

  }

  newGame() {
    this.game = new Game();
  }

  endGame() {
    this.resetRoom();
  }

  playerGuess(playerID: string, guess: Guess): string {
    const currentPlayer = this.getCurrentPlayer();
    if (playerID !== currentPlayer.id) {
      throw new Error('Not your turn!');
    }

    const [currentRow, currentColumn] = this.game.currentPosition;
    const currentCard = this.game.getCurrentCard();

    let correct = false;
    switch (currentRow) {
      case 0:
        correct = this.handleFirstRow(guess as ColorGuess, currentCard);
        break;

      case 1: {
        const previousCard = this.game.getCard(currentRow - 1, currentColumn);
        if (!previousCard) {
          throw new Error('Could not find previous card!');
        }
        correct = this.handleSecondRow(guess as ValueGuess, currentCard, previousCard);
        break;
      }

      case 2: {
        const upperCard = this.game.getCard(currentRow - 1, currentColumn);
        const lowerCard = this.game.getCard(currentRow - 2, currentColumn);
        if (!upperCard || !lowerCard) {
          throw new Error('Could not find the cards!');
        }
        correct = this.handleThirdRow(guess as PositionGuess, currentCard, upperCard, lowerCard);
        break;
      }

      case 3:
        correct = this.handleFourthRow(guess as FigureGuess, currentCard, []);
        break;

      default:
        Logger.warn(`Rule for row${ currentRow } is not implemented`);
    }

    let message = '';
    let drinkingPlayer = this.getCurrentPlayer();

    if (correct) {
      message = 'Correct! ';
      drinkingPlayer = this.getRandomPlayer();
    } else {
      message = 'Wrong!';
    }

    const amount = (currentRow + 1) * 2;

    message += `${ drinkingPlayer.name } drink ${ amount } sips!`;

    this.game.turnCurrentCard();
    this.nextPlayer();

    return message;
  }

  private getRandomPlayer() {
    return this.players[Math.floor(Math.random() * this.players.length)];
  }

  private handleFirstRow(guess: ColorGuess, currentCard: Card): boolean {
    switch (guess) {
      case 'red':
        return currentCard.figure == CardType.Diamond || currentCard.figure == CardType.Heart;
      case 'black':
        return currentCard.figure == CardType.Clubs || currentCard.figure == CardType.Spades;
      default:
        Logger.warn(`handleFirstRow - ${ guess } not implemented!`);
        break;
    }
    return true;
  }

  private handleSecondRow(guess: ValueGuess, currentCard: Card, previousCard: Card): boolean {
    // TODO: fix value J > A, 2 > A etc.
    switch (guess) {
      case 'higher':
        return currentCard.value > previousCard.value;
      case 'lower':
        return currentCard.value < previousCard.value;
      case 'equal':
        return currentCard.value === previousCard.value;
      default:
        Logger.warn(`handleSecondRow - ${ guess } not implemented!`);
        break;
    }
    return true;
  }

  private handleThirdRow(guess: PositionGuess, currentCard: Card, lowerCard: Card, upperCard: Card): boolean {
    switch (guess) {
      case 'inside':
        return upperCard.value > currentCard.value && currentCard.value > lowerCard.value;
      case 'outside':
        return currentCard.value > upperCard.value || lowerCard.value > currentCard.value;
      case 'equal':
        return upperCard.value === lowerCard.value || currentCard.value === lowerCard.value;
      default:
        Logger.warn(`handleThirdRow - ${ guess } not implemented!`);
        break;
    }
    return true;
  }

  private handleFourthRow(guess: FigureGuess, currentCard: Card, otherCards: Card[]): boolean {
    // switch (guess) {
    //   case 'inside':
    //     return upperCard.value > currentCard.value && currentCard.value > lowerCard.value;
    //   case 'outside':
    //     return currentCard.value > upperCard.value || lowerCard.value > currentCard.value;
    //   case 'equal':
    //     return upperCard.value === lowerCard.value || currentCard.value === lowerCard.value;
    //   default:
    //     Logger.warn(`handleThirdRow - ${ guess } not implemented!`);
    //     break;
    // }
    return true;
  }
}

interface IQueue<T> {
  enqueue(items: T[]): void;

  enqueue(item: T): void;

  dequeue(): T;

  size(): number;
}

class Queue<T> implements IQueue<T> {
  private storage: T[] = [];

  enqueue(items: T[]): void;
  enqueue(item: T): void;
  enqueue(itemOrItems: T | T[]): void {
    if (Array.isArray(itemOrItems)) {
      this.storage.push(...itemOrItems);
    } else {
      this.storage.push(itemOrItems);

    }
  }

  dequeue(): T | undefined {
    return this.storage.shift();
  }

  current(): T | undefined {
    return this.storage[0];
  }

  size(): number {
    return this.storage.length;
  }
}
