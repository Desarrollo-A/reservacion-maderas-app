import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverService } from '../../../components/popover/popover.service';
import { ToolbarNotificationsDropdownComponent } from './toolbar-notifications-dropdown/toolbar-notifications-dropdown.component';
import { NotificationService } from "./services/notification.service";
import { NotificationModel } from "./models/notification.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { PopoverRef } from "../../../components/popover/popover-ref";
import { UserSessionService } from "../../../../core/services/user-session.service";
import { PusherService } from "../../../../core/services/pusher.service";
import { pathEventsRealtime } from "../../../utils/utils";
import { PusherChannel } from "../../../../core/enums/pusher-channel";
import { PusherEvent } from "../../../../core/enums/pusher-event";

@UntilDestroy()
@Component({
  selector: 'vex-toolbar-notifications',
  templateUrl: './toolbar-notifications.component.html',
  styleUrls: ['./toolbar-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarNotificationsComponent implements OnInit {
  @ViewChild('originRef', { static: true, read: ElementRef }) originRef: ElementRef;

  dropdownOpen: boolean;
  notifications: NotificationModel[];
  popoverRef: PopoverRef;

  constructor(private popover: PopoverService,
              private cd: ChangeDetectorRef,
              private notificationService: NotificationService,
              private userSessionService: UserSessionService,
              private pusherService: PusherService) {}

  ngOnInit() {
    this.notificationService.findAllUnread();

    this.notificationService.notifications$.asObservable()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(notifications => {
        this.notifications = notifications;
        this.cd.markForCheck();
      });

    this.notificationService.notificationsClicked$.asObservable().pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      if (this.popoverRef && this.dropdownOpen) {
        this.dropdownOpen = false;
        this.popoverRef.close();
      }
      this.cd.markForCheck();
    });

    this.pusherService.channel(PusherChannel.ALERT_NOTIFICATION + this.userSessionService.user.id)
      .bind(pathEventsRealtime(PusherEvent[PusherEvent.AlertNotification]), (data) => {
        this.notificationService.addNotification(new NotificationModel(data.notification));
      });
  }

  get unreadNotifications(): number {
    const unread = this.notifications.filter(notification => notification.isRead === false);
    return unread.length;
  }

  showPopover() {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    this.popoverRef = this.popover.open({
      content: ToolbarNotificationsDropdownComponent,
      origin: this.originRef,
      offsetY: 12,
      position: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ]
    });

    this.popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
}
