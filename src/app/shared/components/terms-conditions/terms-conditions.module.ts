import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TermsConditionsRequestCarComponent
} from './terms-conditions-request-car/terms-conditions-request-car.component';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [
    TermsConditionsRequestCarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TermsConditionsRequestCarComponent
  ]
})
export class TermsConditionsModule { }
