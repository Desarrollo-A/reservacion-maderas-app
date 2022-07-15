import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/core/services/user-session.service';

@Component({
  selector: 'vex-widget-assistant',
  templateUrl: './widget-assistant.component.html',
  styleUrls: ['./widget-assistant.component.scss']
})
export class WidgetAssistantComponent implements OnInit{

  constructor( private userService: UserSessionService) { }

  get userFullName(): string{
   return this.userService.user.fullName;
  } 
  
  
  ngOnInit() {
  }

}
