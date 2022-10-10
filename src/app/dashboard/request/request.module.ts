import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { MaterialModule } from "../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { PhoneRequestTableComponent } from './components/phone-request-table/phone-request-table.component';
import { PhoneCreateUpdateComponent } from './components/phone-create-update/phone-create-update.component';
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { SimplePaginatorModule } from "../../shared/components/simple-paginator/simple-paginator.module";


@NgModule({
  declarations: [
    RoomComponent,
    PhoneRequestTableComponent,
    PhoneCreateUpdateComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    PageNotFoundModule,
    PageLayoutModule,
    SimplePaginatorModule
  ]
})
export class RequestModule { }
