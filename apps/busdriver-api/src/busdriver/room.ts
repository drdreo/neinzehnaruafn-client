import { v4 as uuidv4 } from 'uuid';
import { Player } from './player';

class Game {
}

export class Room {
  players: Player[] = [];

  private game?: Game;

  constructor(public name: string) {
  }

  addPlayer(username: string): string {
    const id = uuidv4();
    this.players.push(new Player(id, username));
    return id;
  }

  removePlayer(player: Player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  getPlayer(playerID: string) {
    return this.players.find(p => p.id === playerID);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getGame(): Game {
    return this.game;
  }

  hasGame(): boolean {
    return !!this.game;
  }

  newGame() {
    if (this.players.length < 1) {
      throw new Error('Cant start game. Too less players are in.');
    }

    this.resetRoom();

    this.game = new Game();
  }

  endGame() {
    this.resetRoom();
  }

  private resetRoom() {
    this.game = null;

    this.players.map(player => player.reset());
  }

}
