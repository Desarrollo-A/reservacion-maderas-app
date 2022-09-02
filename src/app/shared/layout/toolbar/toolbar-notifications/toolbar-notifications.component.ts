import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverService } from '../../../components/popover/popover.service';
import { ToolbarNotificationsDropdownComponent } from './toolbar-notifications-dropdown/toolbar-notifications-dropdown.component';
import { NotificationService } from "./services/notification.service";
import { NotificationModel } from "./models/notification.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { PopoverRef } from "../../../components/popover/popover-ref";

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
              private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.findAllUnread();

    this.notificationService.notifications$.asObservable()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(notifications => {
        this.notifications = notifications;
        if (this.popoverRef && this.dropdownOpen) {
          this.dropdownOpen = false;
          this.popoverRef.close();
        }
        this.cd.markForCheck();
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
