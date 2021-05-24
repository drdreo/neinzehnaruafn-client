import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Player } from './player';
import { Room } from './room';

class GameStartedError extends Error {
  message = 'Game already started!';
}

@Injectable()
export class BusdriverService {

  private rooms: Room[] = [];
  private logger = new Logger(BusdriverService.name);
  private destroyTimeout: NodeJS.Timeout;


  playerExists(playerID: string): boolean {
    return this.rooms.some((room) => {
      return room.players.some(player => player.id === playerID);
    });
  }

  getRoom(name: string): Room {
    return this.rooms.find(room => room.name === name);
  }

  getRoomOfPlayer(playerID: string): Room | undefined {
    return this.rooms.find(room => room.players.some(player => player.id === playerID));
  }

  getPlayersUpdate(room: string): Player[] {
    return this.getRoom(room).getPlayers();
  }

  private addRoom(roomName: string): Room {
    const room = new Room(roomName);
    this.rooms.push(room);
    return room;
  }

  join(username: string, room: string, playerID?: string) {
    let sanitizedRoom = room.toLowerCase();
    let newPlayerID;

    // existing Player needs to reconnect
    if (playerID && this.playerExists(playerID)) {
      this.logger.log(`Player[${ username }] needs to reconnect!`);
      newPlayerID = playerID;
      const room = this.reconnectPlayer(playerID);
      this.logger.debug(`Players last room[${ room.name }] found!`);

      if (room.name !== sanitizedRoom) {
        this.logger.warn(`Player tried to join other room than they were playing on!`);
        sanitizedRoom = room.name;
      }
    } else if (username) {   // new Player wants to create or join
      this.logger.debug(`New Player[${ username }] wants to create or join [${ sanitizedRoom }]!`);
      try {
        newPlayerID = this.createOrJoinRoom(sanitizedRoom, username);
      } catch (e) {
        if (e instanceof GameStartedError) {
          throw new HttpException('Game already started', HttpStatus.FORBIDDEN);
        } else {
          console.error(e);
          throw new HttpException('Unknown', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    }

    // inform everyone what someone joined
    const players = this.getRoom(sanitizedRoom).getPlayers();
    return { playerID: newPlayerID, room: sanitizedRoom, players };
  }

  private reconnectPlayer(playerID: string): Room {
    for (const room of this.rooms) {
      const player = room.players.find(player => player.id === playerID);
      if (player) {
        player.disconnected = false;
        return room;
      }
    }
  }

  playerLeft(playerID: string) {
    for (const room of this.rooms) {
      const player = room.getPlayer(playerID);
      if (player) {
        // if the game didnt start yet, just remove the player
        if (!room.hasGame()) {
          room.removePlayer(player);
        } else {
          player.disconnected = true;
        }

        // if every player disconnected, remove the room after some time
        if (this.destroyTimeout) {
          clearTimeout(this.destroyTimeout);
        }

        this.destroyTimeout = setTimeout(() => {
          if (room.players.every(player => player.disconnected)) {
            this.rooms = this.rooms.filter(r => r.name !== room.name);
            this.logger.log(`Room[${ room.name }] removed!`);
          }
        }, 5000);
        return;
      }
    }
  }

  private createOrJoinRoom(roomName: string, username: string): string {
    let room = this.getRoom(roomName);

    if (!room) {
      this.logger.debug(`Player[${ username }] created a room!`);
      room = this.addRoom(roomName);
    }

    this.logger.debug(`Player[${ username }] joining Room[${ roomName }]!`);

    return room.addPlayer(username);
  }

  // PLAYER ACTIONS

  startGame(roomName: string) {
    const room = this.getRoom(roomName);

    if (!room) {
      throw new Error(`Can not start game in Room[${ roomName }] because room does not exist.`);
    }
    if (room.hasGame()) {
      this.logger.warn(`Room[${ roomName }] has already a game in progress!`);
    } else {
      room.startGame();
    }
  }

}
