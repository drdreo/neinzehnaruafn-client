import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BusdriverCoreModule } from '@trial-nerror/busdriver-core';
import { UiModule } from '@trial-nerror/ui';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, BusdriverCoreModule, UiModule]
})
export class HomeModule {}
