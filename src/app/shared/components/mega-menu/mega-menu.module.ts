import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MegaMenuComponent } from './mega-menu.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [MegaMenuComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [MegaMenuComponent]
})
export class MegaMenuModule { }
