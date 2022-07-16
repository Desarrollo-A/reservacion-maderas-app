import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarUserComponent } from './toolbar-user.component';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import { RelativeDateTimeModule } from '../../../pipes/relative-date-time/relative-date-time.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../../material/material.module";
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ToolbarUserComponent,
    ToolbarUserDropdownComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RelativeDateTimeModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [ToolbarUserComponent]
})
export class ToolbarUserModule {
}

