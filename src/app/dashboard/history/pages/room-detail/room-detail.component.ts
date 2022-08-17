import { Component } from '@angular/core';
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { ActivatedRoute } from "@angular/router";
import { RequestRoomService } from "../../../request/services/request-room.service";
import { RequestRoomModel } from "../../../request/models/request-room.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { switchMap, tap } from "rxjs";

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class RoomDetailComponent {
  requestRoom: RequestRoomModel;
  statusChange: Lookup[] = [];

  breadcrumbs: Breadcrumbs[] = [
    { link: '/dashboard/historial/sala', label: 'Historial' }
  ];

  constructor(private route: ActivatedRoute,
              private requestRoomService: RequestRoomService) {
    this.route.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  findByRequestId(requestId: number): void {
    this.requestRoomService.findByRequestId(requestId).pipe(
      tap(requestRoom => this.requestRoom = requestRoom),
      switchMap(requestRoom => this.requestRoomService.getStatusByStatusCurrent(requestRoom.request.status.name))
    ).subscribe(status => this.statusChange = status);
  }
}
