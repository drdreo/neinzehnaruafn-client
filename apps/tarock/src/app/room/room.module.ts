import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { UiModule } from '@trial-nerror/ui';
import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';

@NgModule({
  declarations: [RoomComponent],
  imports: [CommonModule, RoomRoutingModule, ReactiveComponentModule, UiModule],
})
export class RoomModule {}
