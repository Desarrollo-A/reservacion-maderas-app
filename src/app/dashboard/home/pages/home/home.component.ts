import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { DashboardService } from "../../../../core/services/dashboard.service";
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

  constructor(private userSessionService: UserSessionService,
              private homeService: DashboardService) { }

  get isRecepcionist(): boolean {
   return this.userSessionService.isRecepcionist;
  }

  get isAdmin(): boolean {
    return this.userSessionService.isAdmin;
  }

  get isDriver(): boolean {
    return this.userSessionService.isDriver;
  }

  get isApplicant(): boolean {
    return this.userSessionService.isApplicant;
  }

  get isDepartmentManager(): boolean {
    return this.userSessionService.isDepartmentManager;
  }

  ngOnInit(): void {
    if (!this.isAdmin) {
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
}
