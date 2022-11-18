import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { MaterialModule } from "../../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CarComponent } from './pages/car/car.component';
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { ChangeStatusRoomComponent } from './components/change-status-room/change-status-room.component';
import { ChangeStatusCarComponent } from './components/change-status-car/change-status-car.component';
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { BreadcrumbsModule } from 'src/app/shared/components/breadcrumbs/breadcrumbs.module';
import { RoomCreateUpdateComponent } from './components/room-create-update/room-create-update.component';
import { CarCreateUpdateComponent } from './components/car-create-update/car-create-update.component';
import { DriverComponent } from './pages/driver/driver.component';


@NgModule({
  declarations: [
    RoomComponent,
    CarComponent,
    ChangeStatusRoomComponent,
    ChangeStatusCarComponent,
    RoomCreateUpdateComponent,
    CarCreateUpdateComponent,
    DriverComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    MaterialModule,
    PaginatorModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundModule,
    BreadcrumbsModule
  ]
})
export class MaintenanceModule { }
