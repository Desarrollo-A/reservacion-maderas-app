import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigPanelComponent } from './config-panel.component';
import { ConfigPanelToggleComponent } from './config-panel-toggle/config-panel-toggle.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { MaterialModule } from "../../../material/material.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveComponentModule,
    MaterialModule
  ],
  declarations: [ConfigPanelComponent, ConfigPanelToggleComponent],
  exports: [ConfigPanelComponent, ConfigPanelToggleComponent]
})
export class ConfigPanelModule {
}
