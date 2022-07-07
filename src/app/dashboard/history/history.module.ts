import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { CarComponent } from './pages/car/car.component';
import { DriverComponent } from './pages/driver/driver.component';


@NgModule({
  declarations: [
    RoomComponent,
    CarComponent,
    DriverComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
