import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { MaterialModule } from "../../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MaintenanceModule { }
