import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'trial-nerror-game',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  room: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.room = this.route.snapshot.paramMap.get('room');
  }
}
