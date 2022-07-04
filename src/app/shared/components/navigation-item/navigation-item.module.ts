import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationItemComponent } from './navigation-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [NavigationItemComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [NavigationItemComponent]
})
export class NavigationItemModule {
}
