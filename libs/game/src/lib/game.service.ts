import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerEntity, GameEntity } from '@trial-nerror/game';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_API = 'localhost:3000';


@Injectable()
export class GameService {


  playersUpdated$: Observable<PlayerEntity[]>;
  currentPlayerUpdated$: Observable<string>;

  constructor(private http: HttpClient, private socket: Socket) {
    this.playersUpdated$ = this.fromPlayersUpdate();
    this.currentPlayerUpdated$ = this.fromCurrentPlayerUpdate();
  }

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  loadGame(playerName: string, room: string): Observable<GameEntity> {
    return this.http.post<any>(BACKEND_API + '/game', { playerName, room });
  }

  private fromPlayersUpdate(): Observable<PlayerEntity[]> {
    return this.socket.fromEvent('players:update').pipe(map((data: any) => data.players));
  }

  private fromCurrentPlayerUpdate(): Observable<string> {
    return this.socket.fromEvent('current-player:update').pipe(map((data: any) => data.playerId));
  }
}
