import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { MaterialModule } from "../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { PhoneRequestModule } from "../../shared/components/phone-request/phone-request.module";
import { EmailRequestModule } from "../../shared/components/email-request/email-request.module";
import { AddressModule } from "../../shared/components/address/address.module";
import { DriverComponent } from './pages/driver/driver.component';
import { CarComponent } from './pages/car/car.component';
import { TermsConditionsModule } from "../../shared/components/terms-conditions/terms-conditions.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { SimplePaginatorModule } from "../../shared/components/simple-paginator/simple-paginator.module";
import { DecimalModule } from "../../shared/directives/decimal/decimal.module";


@NgModule({
  declarations: [
    RoomComponent,
    DriverComponent,
    CarComponent
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
    TermsConditionsModule,
    PageLayoutModule,
    SimplePaginatorModule,
    DecimalModule
  ]
})
export class RequestModule { }
