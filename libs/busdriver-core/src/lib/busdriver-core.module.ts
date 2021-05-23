import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromBusdriver from './+state/busdriver/busdriver.reducer';
import { BusdriverEffects } from './+state/busdriver/busdriver.effects';
import { BusdriverFacade } from './+state/busdriver/busdriver.facade';
import { HttpService } from './http.service';
import { SocketService } from './socket.service';

const config: SocketIoConfig = { url: 'http://localhost:1234', options: {} };

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    StoreModule.forFeature(
      fromBusdriver.BUSDRIVER_FEATURE_KEY,
      fromBusdriver.reducer
    ),
    EffectsModule.forFeature([BusdriverEffects]),
  ],
  providers: [BusdriverFacade, HttpService, SocketService],
})
export class BusdriverCoreModule {}
