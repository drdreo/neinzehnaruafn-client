import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomDetailsComponent {
  @Input() name: string;
  @Input() players: any[];

  constructor() {}
}
