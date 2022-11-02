import { Component } from '@angular/core';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { NameRole } from "../../../../core/enums/name-role";

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
    return this.userService.user.role?.name === NameRole.ADMIN;
  }

  get isRecepcionist(): boolean {
    return this.userService.user.role?.name === NameRole.RECEPCIONIST ?? false;
  }

  get isApplicant(): boolean {
    return this.userService.user.role?.name === NameRole.APPLICANT;
  }
}
