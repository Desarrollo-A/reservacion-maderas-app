import { Component, OnInit } from '@angular/core';
import { trackById } from '../../../../utils/track-by';
import { NotificationService } from "../services/notification.service";
import { NotificationModel } from "../models/notification.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'vex-toolbar-notifications-dropdown',
  templateUrl: './toolbar-notifications-dropdown.component.html',
  styleUrls: ['./toolbar-notifications-dropdown.component.scss']
})
export class ToolbarNotificationsDropdownComponent implements OnInit {

  trackById = trackById;
  notifications: NotificationModel[];
  notificationMapping: { [k: string]: string } = {
    '=0': 'notificaciones',
    '=1': 'notificación',
    'other': 'notificaciones'
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.asObservable()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(notifications => this.notifications = notifications);
  }

  get unreadNotifications(): number {
    const unread = this.notifications.filter(notification => notification.isRead === false);
    return unread.length;
  }
}
