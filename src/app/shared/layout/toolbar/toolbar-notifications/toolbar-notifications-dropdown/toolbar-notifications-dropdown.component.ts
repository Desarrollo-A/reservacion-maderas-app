import { Component, OnInit } from '@angular/core';
import { trackById } from '../../../../utils/track-by';
import { NotificationService } from "../services/notification.service";
import { NotificationModel } from "../models/notification.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Router } from "@angular/router";
import { UserSessionService } from "../../../../../core/services/user-session.service";
import { NameRole } from "../../../../../core/enums/name-role";
import { TypeNotificationLookup } from "../enums/type-notification.lookup";
import { I18nPlural } from "../../../../../core/interfaces/i18n-plural";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmRequestComponent } from "../components/confirm-request/confirm-request.component";
import { ToastrService } from "ngx-toastr";
import { CancelRequestComponent } from "../components/cancel-request/cancel-request.component";
import { CancelRequestModel } from "../../../../../core/models/cancel-request.model";
import { RequestRoomService } from "../../../../../core/services/request-room.service";
import { switchMap } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'vex-toolbar-notifications-dropdown',
  templateUrl: './toolbar-notifications-dropdown.component.html',
  styleUrls: ['./toolbar-notifications-dropdown.component.scss']
})
export class ToolbarNotificationsDropdownComponent implements OnInit {
  trackById = trackById;
  notifications: NotificationModel[];
  notificationMapping: I18nPlural = {
    '=0': 'notificaciones',
    '=1': 'notificación',
    'other': 'notificaciones'
  };

  constructor(private notificationService: NotificationService,
              private router: Router,
              private userSessionService: UserSessionService,
              private requestRoomService: RequestRoomService,
              private dialog: MatDialog,
              private toastrService: ToastrService) {}

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
        this.actionNotification(notification);
      });
    } else {
      this.actionNotification(notification);
    }
  }

  private actionNotification(notification: NotificationModel): void {
    if (!notification.requestNotification) {
      return;
    }
    if (!notification.requestNotification.requestId) {
      return;
    }

    if (notification.requestNotification.confirmNotification) {
      // Se verifica si tiene alguna acción extra la notificación
      this.confirmNotification(notification);
    } else if (notification.type.code === TypeNotificationLookup[TypeNotificationLookup.ROOM]) {
      // Si la notificación es de tipo Sala
      this.redirectDetailRoom(notification);
    }
  }

  private redirectDetailRoom(notification: NotificationModel): void {
    if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
      this.router.navigateByUrl(`/dashboard/solicitudes/sala/${notification.requestNotification.requestId}`);
    } else if (this.userSessionService.user.role.name === NameRole.APPLICANT) {
      this.router.navigateByUrl(`/dashboard/historial/sala/${notification.requestNotification.requestId}`);
    }
  }

  private confirmNotification(notification: NotificationModel): void {
    if (!notification.requestNotification.confirmNotification.isAnswered) {
      // Si no está respondida la confirmación
      this.notificationService.findById(notification.id).subscribe(result => {
        this.dialog.open(ConfirmRequestComponent, {
          data: result,
          autoFocus: false
        }).afterClosed().subscribe((confirm: boolean) => {
          if (confirm === true) {
            this.notificationService.answeredNotification(notification.id).subscribe(() => {
              this.toastrService.success('Gracias por confirmar tu solicitud', 'Proceso exitoso');
            });
          } else if (confirm === false) {
            this.cancelRequest(notification);
          }
        });
      });
    } else {
      this.redirectDetailRoom(notification);
    }
  }

  private cancelRequest(notification: NotificationModel): void {
    this.dialog.open(CancelRequestComponent, {
      data: notification.requestNotification.request,
      autoFocus: false
    }).afterClosed().subscribe((cancelRequest: CancelRequestModel) => {
      if (cancelRequest) {
        this.requestRoomService.cancelRequest(notification.requestNotification.requestId, cancelRequest).pipe(
          switchMap(() => this.notificationService.answeredNotification(notification.id))
        ).subscribe(() => {
          this.toastrService.success('Solicitud cancelada correctamente','Proceso exitoso');
          this.redirectDetailRoom(notification);
        });
      }
    });
  }
}

