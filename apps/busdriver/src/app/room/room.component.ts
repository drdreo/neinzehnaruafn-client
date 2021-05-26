import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusdriverFacade, Guess } from '@trial-nerror/busdriver-core';


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

  onGuess(guess: Guess) {
    this.busdriver.guess(guess);
  }

  renderPyramid(){
    // for (let i = pyramid.length - 1; i >= 0; i--) {
    //   let output = '';
    //   for (let j = 0; j < pyramid[i].length; j++) {
    //     const entry = pyramid[i][j];
    //     if (entry) {
    //       output += (entry.value + entry.figure).padStart(3, ' ');
    //     } else {
    //       output += '[ ]';
    //     }
    //     output += ' ';
    //   }
    //   console.log(output);
    // }
  }
}
