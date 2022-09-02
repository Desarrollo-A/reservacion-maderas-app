import { Component, OnInit } from '@angular/core';
import { trackById } from '../../../../utils/track-by';
import { NotificationService } from "../services/notification.service";
import { NotificationModel } from "../models/notification.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Router } from "@angular/router";
import { UserSessionService } from "../../../../../core/services/user-session.service";
import { NameRole } from "../../../../../core/enums/name-role";
import { TypeNotificationLookup } from "../enums/type-notification.lookup";

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

  constructor(private notificationService: NotificationService,
              private router: Router,
              private userSessionService: UserSessionService) {}

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

  readAll(): void {
    if (this.unreadNotifications > 0) {
      this.notificationService.readAllNotifications().subscribe();
    }
  }

  openNotification(notification: NotificationModel): void {
    if (!notification.isRead) {
      this.notificationService.readNotification(notification.id).subscribe(() => {
        if (notification.typeName === TypeNotificationLookup.ROOM) {
          this.redirectDetailRoom(notification);
        }
      });

      return;
    }

    if (notification.typeName === TypeNotificationLookup.ROOM) {
      this.redirectDetailRoom(notification);
    }
  }

  private redirectDetailRoom(notification: NotificationModel): void {
    if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
      this.router.navigateByUrl(`/dashboard/solicitudes/sala/${notification.requestId}`);
    } else if (this.userSessionService.user.role.name === NameRole.APPLICANT) {
      this.router.navigateByUrl(`/dashboard/historial/sala/${notification.requestId}`);
    }
  }
}
