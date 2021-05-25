import { Logger } from '@nestjs/common';
import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody
} from '@nestjs/websockets';
import { PlayerEvent } from '@trial-nerror/busdriver-core';
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
    const roomName = this.busdriverService.getRoomOfPlayer(playerID).name;
    this.handlePlayerDisconnect(playerID, roomName);
    this.disconnectSocket(socket, roomName);
    this.sendPlayersUpdate(roomName);
  }

  @SubscribeMessage(PlayerEvent.StartGame)
  onPlayerStart(@ConnectedSocket() socket: Socket) {
    const playerID = socket['playerID'];
    this.logger.debug(`Player[${ playerID }] started the game!`);
    const room = this.busdriverService.getRoomOfPlayer(playerID);

    room.startGame();
    this.sendPyramidUpdate(room);
  }

  @SubscribeMessage(PlayerEvent.Guess)
  onPlayerGuess(@ConnectedSocket() socket: Socket, @MessageBody() guess: string) {
    const playerID = socket['playerID'];
    this.logger.debug(`Player[${ playerID }] guessed!`);
    this.logger.debug(guess);

    const room = this.busdriverService.getRoomOfPlayer(playerID);

    room.playerGuess(guess);
    this.sendPyramidUpdate(room);
  }

  private sendPlayersUpdate(room: string) {
    this.sendTo(room, PlayerEvent.Update, { players: this.busdriverService.getPlayersUpdate(room) });
  }

  private sendPyramidUpdate(room: Room) {
    const pyramid = room.getGame().getPyramid();
    this.sendTo(room.name, 'pyramid:update', { pyramid });
  }
}
