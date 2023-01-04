import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { SummaryDay } from "./interfaces/summary-day";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { QuickpanelService } from "./services/quickpanel.service";
import { NameRole } from "../../../core/enums/name-role";
import { TypeRequestLookup } from "../../../core/enums/lookups/type-request.lookup";
import { Router } from "@angular/router";
import { UserSessionService } from "../../../core/services/user-session.service";
import { RequestModel } from "../../../core/models/request.model";
import { LayoutService } from "../../services/layout.service";

@UntilDestroy()
@Component({
  selector: 'vex-quickpanel',
  templateUrl: './quickpanel.component.html',
  styleUrls: ['./quickpanel.component.scss']
})
export class QuickpanelComponent implements OnInit {
  events: SummaryDay[] = [];
  date = DateTime.local().toFormat('DD');
  dayName = DateTime.local().toFormat('EEEE');

  constructor(private router: Router,
              private quickpanelService: QuickpanelService,
              private userSessionService: UserSessionService,
              private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.quickpanelService.events$.asObservable().pipe(
      untilDestroyed(this)
    ).subscribe(events => this.events = events);
  }

  redirectRequestDetail(request: RequestModel): void {
    const part = (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) ? 'solicitudes' : 'historial';
    this.layoutService.closeQuickpanel();

    if (request.type.code === TypeRequestLookup[TypeRequestLookup.ROOM]) {
      this.router.navigateByUrl(`/dashboard/${part}/sala/${request.id}`);
    } else if (request.type.code === TypeRequestLookup[TypeRequestLookup.PARCEL]) {
      this.router.navigateByUrl(`/dashboard/${part}/paqueteria/${request.id}`);
    } else if (request.type.code === TypeRequestLookup[TypeRequestLookup.DRIVER]) {
      this.router.navigateByUrl(`/dashboard/${part}/conductor/${request.id}`);
    } else if (request.type.code === TypeRequestLookup[TypeRequestLookup.CAR]) {
      this.router.navigateByUrl(`/dashboard/${part}/vehiculo/${request.id}`);
    }
  }

  trackById(index: number, row: SummaryDay): number {
    return row.request.id;
  }
}
