import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickpanelComponent } from './quickpanel.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [QuickpanelComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [QuickpanelComponent]
})
export class QuickpanelModule {
}
