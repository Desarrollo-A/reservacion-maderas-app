import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignatureComponent } from './signature.component';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [
    SignatureComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    SignatureComponent
  ]
})
export class SignatureModule { }
