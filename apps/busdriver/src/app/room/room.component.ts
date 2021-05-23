import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusdriverFacade } from '@trial-nerror/busdriver-core';


@Component({
  selector: 'busdriver-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  room: string;

  constructor(
    private route: ActivatedRoute,
    public busdriver: BusdriverFacade
  ) {}

  ngOnInit(): void {
    this.room = this.route.snapshot.paramMap.get('room');

    // TODO reconnect, send data again
    // this.busdriver.recc('asdasdasd',  this.room );

  }

  ngOnDestroy(): void {
    this.busdriver.leave();
  }

  startGame() {
    this.busdriver.startGame();
  }
}
