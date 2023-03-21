import { Component } from '@angular/core';
import { UserSessionService } from 'src/app/core/services/user-session.service';

@Component({
  selector: 'vex-widget-assistant',
  templateUrl: './widget-assistant.component.html',
  styleUrls: ['./widget-assistant.component.scss']
})
export class WidgetAssistantComponent {

  constructor(private userService: UserSessionService) { }

  get userFullName(): string {
   return this.userService.user.fullName ?? '';
  }

  get isAdmin(): boolean {
    return this.userService.isAdmin;
  }

  get isRecepcionist(): boolean {
    return this.userService.isRecepcionist;
  }

  get isApplicant(): boolean {
    return this.userService.isApplicant;
  }

  get isDriver(): boolean {
    return this.userService.isDriver;
  }

  get isDepartmentManager(): boolean {
    return this.userService.isDepartmentManager;
  }
}
