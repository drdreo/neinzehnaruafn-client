import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class SocketService {

  constructor(private socket: Socket) {
  }

  getSocketId() {
    return this.socket.ioSocket.id;
  }

  startGame() {
    this.socket.emit('player:start');
  }

  onPlayersUpdate(): Observable<any> {
    return this.socket.fromEvent<any>('players:update').pipe(map(res => res.players));
  }

  leave() {
    return this.socket.emit('player:leave');
  }
}
