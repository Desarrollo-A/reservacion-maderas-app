import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressComponent } from './address.component';
import { MaterialModule } from "../../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    AddressComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    AddressComponent
  ]
})
export class AddressModule { }
