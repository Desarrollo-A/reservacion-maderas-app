import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneRequestTableComponent } from './components/phone-request-table/phone-request-table.component';
import { MaterialModule } from "../../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PageLayoutModule } from "../page-layout/page-layout.module";
import { SimplePaginatorModule } from "../simple-paginator/simple-paginator.module";
import { PhoneCreateUpdateComponent } from "./components/phone-create-update/phone-create-update.component";


@NgModule({
  declarations: [
    PhoneRequestTableComponent,
    PhoneCreateUpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    PageLayoutModule,
    SimplePaginatorModule
  ],
  exports: [
    PhoneRequestTableComponent
  ]
})
export class PhoneRequestModule { }
