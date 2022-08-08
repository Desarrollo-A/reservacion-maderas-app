import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConfirmComponent } from "./delete-confirm.component";
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [
    DeleteConfirmComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DeleteConfirmModule { }
