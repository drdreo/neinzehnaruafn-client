import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerEvent } from './player-events';


@Injectable()
export class SocketService {

  constructor(private socket: Socket) {
  }

  getSocketId() {
    return this.socket.ioSocket.id;
  }

  startGame() {
    this.socket.emit(PlayerEvent.StartGame);
  }

  leave() {
    return this.socket.emit(PlayerEvent.Leave);
  }

  guess() {
    return this.socket.emit(PlayerEvent.Guess);
  }

  onPlayersUpdate(): Observable<any> {
    return this.socket.fromEvent<any>(PlayerEvent.Update).pipe(map(res => res.players));
  }

  onPyramidUpdate(): Observable<any> {
    return this.socket.fromEvent<any>('pyramid:update').pipe(map(res => res.pyramid));
  }

}
