import { Component, ViewChild } from '@angular/core';
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestRoomService } from "../../../request/services/request-room.service";
import { RequestRoomModel } from "../../../request/models/request-room.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { switchMap, tap } from "rxjs";
import { InventoryService } from "../../../inventory/services/inventory.service";
import { InventoryModel } from "../../../inventory/models/inventory.model";
import { StatusRequestLookup } from "../../enums/status-request.lookup";
import { SnackDetailComponent } from "../../components/snack-detail/snack-detail.component";
import { InventoryRequestModel } from "../../models/inventory-request.model";
import { ToastrService } from "ngx-toastr";

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
  @ViewChild('snackDetailComponent')
  snackDetailComponent: SnackDetailComponent;

  requestRoom: RequestRoomModel;
  statusChange: Lookup[] = [];
  snackList: InventoryModel[] = [];
  previousStatus: Lookup;

  breadcrumbs: Breadcrumbs[] = [
    { link: '/dashboard/historial/sala', label: 'Historial' }
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestRoomService: RequestRoomService,
              private inventoryService: InventoryService,
              private toastrService: ToastrService) {
    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  get statusRequest(): typeof StatusRequestLookup {
    return StatusRequestLookup;
  }

  findByRequestId(requestId: number): void {
    this.requestRoomService.findByRequestId(requestId).pipe(
      tap(requestRoom => {
        this.requestRoom = requestRoom;
        this.previousStatus = {... requestRoom.request.status};
      }),
      switchMap(requestRoom => this.requestRoomService.getStatusByStatusCurrent(requestRoom.request.status.name)),
      tap(status => this.statusChange = status),
      switchMap(() => this.inventoryService.findAllSnacks())
    ).subscribe(snackList => {
      this.snackList = snackList;
      if (this.requestRoom.request.status.name === StatusRequestLookup.NEW) {
        this.requestRoomService.availableRoom(this.requestRoom.request).subscribe(({isAvailable}) => {
          if (!isAvailable) {
            const index = this.statusChange.findIndex(status => status.name === StatusRequestLookup.APPROVED);
            this.statusChange.splice(index, 1);
          }
        });
      }
    });
  }

  changeStatus(status: Lookup): void {
    this.requestRoom.request.status = status;
  }

  save(): void {
    if (this.requestRoom.request.statusName === StatusRequestLookup.APPROVED) {
      if (this.snackDetailComponent?.snacks.length > 0) {
        const snacks = this.snackDetailComponent?.snacks;
        this.requestRoomService.assignSnacks(this.prepareDataToAssignSnack(snacks))
          .subscribe(() => {
            this.toastrService.success('Solicitud aprobada', 'Proceso exitoso');
            this.router.navigateByUrl('/dashboard/historial/sala');
          });
      } else {
        this.toastrService.info('No hay ningún snack asignado', 'Información');
      }
    }
  }

  prepareDataToAssignSnack(inventories: InventoryModel[]): { requestId: number, inventoryRequest: InventoryRequestModel[] } {
    let snacks: InventoryRequestModel[] = [];
    inventories.forEach(inventory => {
      snacks.push(inventory.inventoryRequest);
    });
    return { requestId: this.requestRoom.requestId, inventoryRequest: snacks };
  }
}
