import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameFacade, PlayerFacade } from '@trial-nerror/game';

@Component({
  selector: 'trial-nerror-game',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor(private route: ActivatedRoute, public gameFacade: GameFacade, public playerFacade: PlayerFacade) {

  }

  ngOnInit(): void {
    const room = this.route.snapshot.paramMap.get('room');

    this.gameFacade.init(room);

  }
}
