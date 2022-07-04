import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [
    UserMenuComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ]
})
export class UserMenuModule {
}
