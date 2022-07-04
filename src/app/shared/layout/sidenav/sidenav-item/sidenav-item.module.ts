import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavItemComponent } from './sidenav-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../../material/material.module";

@NgModule({
  declarations: [SidenavItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [SidenavItemComponent]
})
export class SidenavItemModule {
}
