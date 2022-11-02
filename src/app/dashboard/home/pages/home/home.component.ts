import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { NameRole } from 'src/app/core/enums/name-role';
import { HomeService } from "../../../../core/services/home.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newRequests = 0;
  approvedRequests = 0;
  cancelledRequests = 0;
  totalRequests = 0;
  totalRequestsOfMonth = 0;
  percentage = 0;
  requestSeries: ApexAxisChartSeries = [{
    name: 'Solicitudes',
    data: []
  }];

  constructor(private userService: UserSessionService,
              private homeService: HomeService) { }

  get userRole(): boolean {
   return this.userService.user.role?.name == NameRole.RECEPCIONIST;
  }

  ngOnInit(): void {
    this.homeService.getDataHome().subscribe(({ cards, last7DaysRequests, percentage, totalMonth}) => {
      this.newRequests = cards.news;
      this.approvedRequests = cards.approved;
      this.cancelledRequests = cards.cancelled;
      this.totalRequests = cards.requests;
      this.percentage = percentage;
      this.requestSeries = [{
        name: 'Solicitudes',
        data: last7DaysRequests
      }];
      this.totalRequestsOfMonth = totalMonth;
    });
  }
}
