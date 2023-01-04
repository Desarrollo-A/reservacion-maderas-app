import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
import { MatMenuTrigger } from "@angular/material/menu";
import { ActionRequestNotificationLookup } from "../enums/action-request-notification.lookup";
import { RatingRequestComponent } from "../components/rating-request/rating-request.component";
import { ScoreModel } from "../../../../../core/models/score.model";
import { RequestService } from "../../../../../core/services/request.service";

interface Position {
  x: string;
  y: string;
}

@UntilDestroy()
@Component({
  selector: 'vex-toolbar-notifications-dropdown',
  templateUrl: './toolbar-notifications-dropdown.component.html',
  styleUrls: ['./toolbar-notifications-dropdown.component.scss']
})
export class ToolbarNotificationsDropdownComponent implements OnInit {
  @ViewChild('menuNotifications', { static: false}) menuNotifications: any
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger: MatMenuTrigger;

  trackById = trackById;
  notifications: NotificationModel[];
  notificationMapping: I18nPlural = {
    '=0': 'notificaciones',
    '=1': 'notificación',
    'other': 'notificaciones'
  };
  menuTopLeftPosition: Position = { x: '0', y: '0' };

  constructor(private notificationService: NotificationService,
              private router: Router,
              private userSessionService: UserSessionService,
              private requestRoomService: RequestRoomService,
              private dialog: MatDialog,
              private toastrService: ToastrService,
              private requestService: RequestService) {}

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

  onRightClick(event: MouseEvent, notification: NotificationModel) {
    const posMenu = this.menuNotifications.nativeElement.getBoundingClientRect();
    if (!notification.isRead) {
      event.preventDefault();
      this.menuTopLeftPosition.x = `${event.clientX - posMenu.left}px`;
      this.menuTopLeftPosition.y = `${event.clientY - posMenu.top}px`;

      this.matMenuTrigger.menuData = { notification };
      this.matMenuTrigger.openMenu();
    }
  }

  readAll(): void {
    if (this.unreadNotifications > 0) {
      this.notificationService.readAllNotifications().subscribe();
    }
  }

  readNotification(id: number): void {
    this.notificationService.readNotification(id).subscribe();
  }

  openNotification(notification: NotificationModel): void {
    this.notificationService.notificationsClicked$.next();
    if (!notification.isRead) {
      this.notificationService.readNotification(notification.id).subscribe(() => {
        this.actionNotification(notification);
      });
    } else {
      this.actionNotification(notification);
    }
  }

  private actionNotification(notification: NotificationModel): void {
    if (notification.requestNotification?.actionRequestNotification) {
      // Se verifica si tiene alguna acción extra la notificación
      if (notification.requestNotification.actionRequestNotification.type.code === ActionRequestNotificationLookup[ActionRequestNotificationLookup.CONFIRM]) {
        this.confirmNotification(notification);
      } else if (notification.requestNotification.actionRequestNotification.type.code === ActionRequestNotificationLookup[ActionRequestNotificationLookup.SCORE]) {
        this.starRatingNotification(notification);
      }
    } else if (notification.type.code === TypeNotificationLookup[TypeNotificationLookup.ROOM] &&
        notification.requestNotification?.requestId) {
      // Si la notificación es de tipo Sala
      this.redirectDetailRoom(notification);
    } else if (notification.type.code === TypeNotificationLookup[TypeNotificationLookup.INVENTORY]) {
      this.redirectInventory();
    } else if(notification.type.code === TypeNotificationLookup[TypeNotificationLookup.PARCEL] &&
      notification.requestNotification?.requestId){
        this.redirectPackage(notification);
    } else if(notification.type.code === TypeNotificationLookup[TypeNotificationLookup.DRIVER] &&
      notification.requestNotification?.requestId){
        this.redirectDriver(notification);
    } else if(notification.type.code === TypeNotificationLookup[TypeNotificationLookup.CAR] &&
      notification.requestNotification?.requestId){
      this.redirectCar(notification);
    }
  }

  private redirectDetailRoom(notification: NotificationModel): void {
    if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
      this.router.navigateByUrl(`/dashboard/solicitudes/sala/${notification.requestNotification.requestId}`);
    } else if (this.userSessionService.user.role.name === NameRole.APPLICANT) {
      this.router.navigateByUrl(`/dashboard/historial/sala/${notification.requestNotification.requestId}`);
    }
  }

  private redirectInventory(): void {
    this.router.navigateByUrl('/dashboard/inventario');
  }

  private redirectPackage(notification: NotificationModel): void{
    if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
      this.router.navigateByUrl(`/dashboard/solicitudes/paqueteria/${notification.requestNotification.requestId}`);
    } else if (this.userSessionService.user.role.name === NameRole.APPLICANT) {
      this.router.navigateByUrl(`/dashboard/historial/paqueteria/${notification.requestNotification.requestId}`);
    }
  }

  private redirectDriver(notification: NotificationModel): void{
    if(this.userSessionService.user.role.name === NameRole.RECEPCIONIST){
      this.router.navigateByUrl(`/dashboard/solicitudes/conductor/${notification.requestNotification.requestId}`);
    }else if(this.userSessionService.user.role.name === NameRole.APPLICANT){
      this.router.navigateByUrl(`/dashboard/historial/conductor/${notification.requestNotification.requestId}`);
    }
  }

  private redirectCar(notification: NotificationModel): void {
    if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
      this.router.navigateByUrl(`/dashboard/solicitudes/vehiculo/${notification.requestNotification.requestId}`);
    } else if (this.userSessionService.user.role.name === NameRole.APPLICANT) {
      this.router.navigateByUrl(`/dashboard/historial/vehiculo/${notification.requestNotification.requestId}`);
    }
  }

  private confirmNotification(notification: NotificationModel): void {
    if (!notification.requestNotification.actionRequestNotification.isAnswered) {
      // Si no está respondida la confirmación
      this.notificationService.findById(notification.id).subscribe(result => {
        this.dialog.open(ConfirmRequestComponent, {
          data: result,
          autoFocus: false
        }).afterClosed().subscribe((confirm: boolean) => {
          if (confirm === true) {
            this.notificationService.answeredNotification(notification.id).subscribe(() => {
              this.toastrService.success('Gracias por confirmar tu solicitud');
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

  private starRatingNotification(notification: NotificationModel): void {
    if (!notification.requestNotification.actionRequestNotification.isAnswered) {
      this.notificationService.findById(notification.id).subscribe(result => {
        this.dialog.open(RatingRequestComponent, {
          data: result,
          autoFocus: false,
          maxWidth: '650px'
        }).afterClosed().subscribe((score: ScoreModel) => {
          if (score) {
            this.requestService.starRatingRequest(score).pipe(
              switchMap(() => this.notificationService.answeredNotification(notification.id))
            ).subscribe(() => {
              this.toastrService.success('Gracias por calificar el servicio');
            });
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

