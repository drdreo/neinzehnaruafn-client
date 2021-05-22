import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameFacade } from '@trial-nerror/game';

@Component({
  selector: 'trial-nerror-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(private gameFacade: GameFacade) {}

  joinRoom({ username, room }) {
    this.gameFacade.loadRoom(username, room);
  }
}
