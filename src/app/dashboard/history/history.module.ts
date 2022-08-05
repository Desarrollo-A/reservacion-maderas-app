import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { CarComponent } from './pages/car/car.component';
import { DriverComponent } from './pages/driver/driver.component';
import { MaterialModule } from "../../material/material.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";


@NgModule({
  declarations: [
    RoomComponent,
    CarComponent,
    DriverComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule
  ]
})
export class HistoryModule { }
