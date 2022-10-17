import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarNotificationsComponent } from './toolbar-notifications.component';
import { PopoverModule } from '../../../components/popover/popover.module';
import { RelativeDateTimeModule } from '../../../pipes/relative-date-time/relative-date-time.module';
import { RouterModule } from '@angular/router';
import {
  ToolbarNotificationsDropdownComponent
} from './toolbar-notifications-dropdown/toolbar-notifications-dropdown.component';
import { MaterialModule } from "../../../../material/material.module";
import { ConfirmRequestComponent } from './components/confirm-request/confirm-request.component';
import { CancelRequestComponent } from './components/cancel-request/cancel-request.component';
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [ToolbarNotificationsComponent, ToolbarNotificationsDropdownComponent, ConfirmRequestComponent, CancelRequestComponent],
  imports: [
    CommonModule,
    PopoverModule,
    MaterialModule,
    RelativeDateTimeModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [ToolbarNotificationsComponent]
})
export class ToolbarNotificationsModule {
}
