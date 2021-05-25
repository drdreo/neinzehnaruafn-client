import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { LoginComponent } from './login/login.component';
import { RoomDetailsComponent } from './room-details/room-details.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [LoginComponent, RoomDetailsComponent, CardComponent],
  exports: [LoginComponent, RoomDetailsComponent, CardComponent]
})
export class UiModule {}
