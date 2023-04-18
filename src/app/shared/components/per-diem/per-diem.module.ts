import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerDiemComponent } from './per-diem.component';
import { MaterialModule } from "../../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { UrlModule } from "../../pipes/url/url.module";

import { DecimalModule } from "../../directives/decimal/decimal.module";
import { UploadMultipleFilesModule } from "../upload-multiple-files/upload-multiple-files.module";

@NgModule({
  declarations: [
    PerDiemComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    UrlModule,
    DecimalModule,
    UploadMultipleFilesModule,
  ],
  exports: [
    PerDiemComponent
  ]
})
export class PerDiemModule { }
