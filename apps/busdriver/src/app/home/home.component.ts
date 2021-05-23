import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BusdriverFacade } from '@trial-nerror/busdriver-core';

@Component({
  selector: 'busdriver-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent  {
  constructor(private busdriver: BusdriverFacade) {}

  joinRoom({ username, room }) {
    this.busdriver.join(username, room);
  }
}
