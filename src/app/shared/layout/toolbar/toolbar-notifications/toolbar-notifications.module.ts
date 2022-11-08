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
import { RatingRequestComponent } from './components/rating-request/rating-request.component';
import { StarRatingModule } from "../../../components/star-rating/star-rating.module";


@NgModule({
  declarations: [
    ToolbarNotificationsComponent,
    ToolbarNotificationsDropdownComponent,
    ConfirmRequestComponent,
    CancelRequestComponent,
    RatingRequestComponent
  ],
  imports: [
    CommonModule,
    PopoverModule,
    MaterialModule,
    RelativeDateTimeModule,
    RouterModule,
    ReactiveFormsModule,
    StarRatingModule
  ],
  exports: [ToolbarNotificationsComponent]
})
export class ToolbarNotificationsModule {
}
