import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerDiemComponent } from './per-diem.component';
import { MaterialModule } from "../../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { UrlModule } from "../../pipes/url/url.module";


@NgModule({
  declarations: [
    PerDiemComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    UrlModule,
  ],
  exports: [
    PerDiemComponent
  ]
})
export class PerDiemModule { }
