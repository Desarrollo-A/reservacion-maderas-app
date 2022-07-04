import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarSearchComponent } from './toolbar-search.component';
import { MaterialModule } from "../../../../material/material.module";


@NgModule({
  declarations: [ToolbarSearchComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ToolbarSearchComponent]
})
export class ToolbarSearchModule {
}
