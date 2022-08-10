import { Component } from '@angular/core';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { NameRol } from 'src/app/core/enums/name-rol';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private userService: UserSessionService) { }

  get userRole(): boolean {
   return this.userService.user.role.name == NameRol.RECEPCIONIST;   
  }

  salesSeries: ApexAxisChartSeries = [{
    name: 'Sales',
    data: [28, 40, 36, 0, 52, 38, 60, 55, 99, 54, 38, 87]
  }];
}
