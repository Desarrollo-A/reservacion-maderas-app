import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetTableComponent } from './widget-table.component';
import { MaterialModule } from "../../../../material/material.module";


@NgModule({
  declarations: [WidgetTableComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [WidgetTableComponent]
})
export class WidgetTableModule {
}
