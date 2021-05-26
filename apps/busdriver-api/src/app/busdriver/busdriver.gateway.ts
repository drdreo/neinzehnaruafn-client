import { Logger } from '@nestjs/common';
import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody, WsException
} from '@nestjs/websockets';
import { PlayerEvent, Guess } from '@trial-nerror/busdriver-core';
import { Server, Socket } from 'socket.io';
import { BusdriverService } from './busdriver.service';
import { Room } from './room';

@WebSocketGateway(1234)
export class BusdriverGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BusdriverGateway.name);

  constructor(private busdriverService: BusdriverService) {}

  private sendTo(recipient: string, event: string, data?: any) {
    this.server.to(recipient).emit(event, data);
  }

  private sendToAll(event: string, data?: any) {
    this.server.emit(event, data);
  }

  handleConnection(socket: Socket) {
    this.logger.log(`New Connection from socket{${ socket.id }}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket{${ socket.id }} disconnected! `);
  }

  private handlePlayerDisconnect(playerID: string | undefined, room: string | undefined) {

    if (playerID && this.busdriverService.playerExists(playerID)) {
      this.logger.debug(`Player[${ playerID }] left!`);
      this.busdriverService.playerLeft(playerID);

      if (room) {
        this.sendTo(room, PlayerEvent.Left, { playerID });
      } else {
        this.logger.error(`Player[${ playerID }] disconnected or left, but room[${ room }] no longer exists!`);
      }
    }
  }


  handlePlayerConnect(socketID: string, room: string, playerID?: string) {
    const socket = this.server.sockets.sockets[socketID];

    if (!socket) {
      throw new Error(`Could not find socket{${ socketID }`);
    }

    socket.join(room);
    socket['playerID'] = playerID; // either overwrite existing one, reset it if its undefined

    this.sendPlayersUpdate(room);
  }

  // to prevent sockets from still receiving game messages. Leaves the table and unsets all socket data
  private disconnectSocket(socket: Socket, room: string) {
    socket.leave(room);
    socket['playerID'] = null;
  }

  @SubscribeMessage(PlayerEvent.Leave)
  onPlayerLeave(@ConnectedSocket() socket: Socket) {
    const playerID = socket['playerID'];
    const room = this.busdriverService.getRoomOfPlayer(playerID);
    this.handlePlayerDisconnect(playerID, room.name);
    this.disconnectSocket(socket, room.name);
    this.sendPlayersUpdate(room);
  }

  @SubscribeMessage(PlayerEvent.StartGame)
  onPlayerStart(@ConnectedSocket() socket: Socket) {
    const playerID = socket['playerID'];
    this.logger.debug(`Player[${ playerID }] started the game!`);
    const room = this.busdriverService.getRoomOfPlayer(playerID);

    room.startGame();
    this.sendPyramidUpdate(room);
    this.sendPlayersUpdate(room);
    this.sendGameGuessesUpdate(room);
  }

  @SubscribeMessage(PlayerEvent.Guess)
  onPlayerGuess(@ConnectedSocket() socket: Socket, @MessageBody() guess: Guess) {
    const playerID = socket['playerID'];
    this.logger.debug(`Player[${ playerID }] guessed ${ guess }!`);

    const room = this.busdriverService.getRoomOfPlayer(playerID);
    const currentRow = room.getGame().getCurrentRow();
    let response: string;

    try {
      response = room.playerGuess(playerID, guess);
    } catch (err) {
      console.error(err);
      throw new WsException(err.message);
    }

    if (currentRow !== room.getGame().getCurrentRow()) {
      this.sendGameGuessesUpdate(room);
    }
    this.sendPyramidUpdate(room);
    this.sendPlayersUpdate(room);
    this.sendPlayerGuessResponse(room.name, response);
  }

  private sendPlayersUpdate(roomOrName: Room | string) {
    let room;
    if (typeof roomOrName === 'string') {
      room = this.busdriverService.getRoom(roomOrName);
    } else {
      room = roomOrName;
    }

    const players = room.getPlayers();
    this.sendTo(room.name, PlayerEvent.Update, { players });
  }

  private sendPyramidUpdate(room: Room) {
    const pyramid = room.getGame().getPyramid();
    this.sendTo(room.name, 'pyramid:update', { pyramid });
  }

  private sendGameGuessesUpdate(room: Room) {
    const guesses = room.getGame().getGuesses();
    this.sendTo(room.name, 'guess:update', { guesses });
  }

  private sendPlayerGuessResponse(room: string, response) {
    this.sendTo(room, PlayerEvent.Guess, response);
  }
}
