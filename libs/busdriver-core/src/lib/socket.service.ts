import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Guess } from './card';
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

  guess(guess: Guess) {
    return this.socket.emit(PlayerEvent.Guess, guess);
  }

  onGuess(): Observable<string> {
    return this.socket.fromEvent<string>(PlayerEvent.Guess);
  }

  onPlayersUpdate(): Observable<any> {
    return this.socket.fromEvent<any>(PlayerEvent.Update).pipe(map(res => res.players));
  }

  onPyramidUpdate(): Observable<any> {
    return this.socket.fromEvent<any>('pyramid:update').pipe(map(res => res.pyramid));
  }

  onGuessesUpdate(): Observable<any> {
    return this.socket.fromEvent<any>('guess:update').pipe(map(res => res.guesses));
  }

}
