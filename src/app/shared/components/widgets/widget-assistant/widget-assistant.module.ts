import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetAssistantComponent } from './widget-assistant.component';
import { MaterialModule } from "../../../../material/material.module";


@NgModule({
  declarations: [WidgetAssistantComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [WidgetAssistantComponent]
})
export class WidgetAssistantModule {
}
