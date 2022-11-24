import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { MaterialModule } from "../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { PhoneRequestModule } from "../../shared/components/phone-request/phone-request.module";
import { EmailRequestModule } from "../../shared/components/email-request/email-request.module";
import { PackageComponent } from './pages/package/package.component';
import { AddressModule } from "../../shared/components/address/address.module";


@NgModule({
  declarations: [
    RoomComponent,
    PackageComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    PageNotFoundModule,
    PhoneRequestModule,
    EmailRequestModule,
    AddressModule,
  ]
})
export class RequestModule { }
