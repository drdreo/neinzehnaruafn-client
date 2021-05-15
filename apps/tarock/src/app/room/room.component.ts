import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameFacade } from '../../../../../libs/game/src/lib/+state/game/game.facade';

@Component({
  selector: 'trial-nerror-game',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private route: ActivatedRoute, public gameFacade: GameFacade) {

  }

  ngOnInit(): void {
    const room = this.route.snapshot.paramMap.get('room');

    this.gameFacade.init(room);

  }
}
