import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3333/busdriver';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {

  }

  test() {
    return this.http.get(API_URL);
  }

  joinRoom(username: string, room: string, socketID: string): Observable<any> {
    return this.http.post(API_URL + '/join', { username, room, socketID, playerID: sessionStorage.getItem('playerID') });
  }

}
