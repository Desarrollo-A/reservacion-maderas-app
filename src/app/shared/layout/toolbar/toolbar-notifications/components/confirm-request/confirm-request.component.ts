import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationModel } from "../../models/notification.model";
import { TypeNotificationLookup } from "../../enums/type-notification.lookup";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.scss']
})
export class ConfirmRequestComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmRequestComponent>,
              private datePipe: DatePipe,
              @Inject(MAT_DIALOG_DATA) public notification: NotificationModel) {}

  get title(): string {
    const typeCode = this.notification.type.code;

    if (typeCode === TypeNotificationLookup[TypeNotificationLookup.ROOM]) {
      return `${this.notification.type.name} ${this.notification.requestNotification.request.requestRoom.room.name}
      en la Oficina ${this.notification.requestNotification.request.requestRoom.room.office.name}`
    }

    return this.notification.type.name;
  }

  get date(): string {
    const typeCode = this.notification.type.code;
    const startDate = `${this.datePipe.transform(this.notification.requestNotification.request.startDate, 'EEEE d, MMMM')}`;

    if (typeCode === TypeNotificationLookup[TypeNotificationLookup.ROOM] ||
      typeCode === TypeNotificationLookup[TypeNotificationLookup.DRIVER] ||
      typeCode === TypeNotificationLookup[TypeNotificationLookup.CAR]) {
      return `${startDate} a las ${this.datePipe.transform(this.notification.requestNotification.request.startDate, 'h:mm a')}`;
    }

    return startDate;
  }
}
