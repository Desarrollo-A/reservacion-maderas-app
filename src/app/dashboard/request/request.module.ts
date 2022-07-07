import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { DriverComponent } from './pages/driver/driver.component';
import { CarComponent } from './pages/car/car.component';


@NgModule({
  declarations: [
    RoomComponent,
    DriverComponent,
    CarComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule
  ]
})
export class RequestModule { }
