import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationModel } from "../../models/notification.model";
import { TypeNotificationLookup } from "../../enums/type-notification.lookup";

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.scss']
})
export class ConfirmRequestComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmRequestComponent>,
              @Inject(MAT_DIALOG_DATA) public notification: NotificationModel) {}

  get title(): string {
    if (this.notification.type.code === TypeNotificationLookup[TypeNotificationLookup.ROOM]) {
      return `${this.notification.type.name} ${this.notification.requestNotification.request.requestRoom.room.name}
      en la Oficina ${this.notification.requestNotification.request.requestRoom.room.office.name}`
    }
  }
}
