import { Component, ViewChild } from '@angular/core';
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestRoomService } from "../../../request/services/request-room.service";
import { RequestRoomModel } from "../../../request/models/request-room.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { delay, of, switchMap, tap } from "rxjs";
import { InventoryService } from "../../../inventory/services/inventory.service";
import { InventoryModel } from "../../../inventory/models/inventory.model";
import { StatusRequestLookup } from "../../enums/status-request.lookup";
import { SnackDetailComponent } from "../../components/snack-detail/snack-detail.component";
import { InventoryRequestModel } from "../../models/inventory-request.model";
import { ToastrService } from "ngx-toastr";
import { UserSessionService } from "../../../../core/services/user-session.service";
import { NameRole } from "../../../../core/enums/name-role";
import { FormBuilder } from "@angular/forms";
import { RequestModel } from "../../../request/models/request.model";
import { ProposalRequestComponent } from "../../components/proposal-request/proposal-request.component";
import { RequestService } from "../../services/request.service";
import { CancelRequestComponent } from "../../components/cancel-request/cancel-request.component";
import { ProposalRequestModel } from "../../../request/models/proposal-request.model";
import { getDateFormat, getTimeFormat } from "../../../../shared/utils/utils";

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
  @ViewChild('proposalRequestComponent')
  proposalRequestComponent: ProposalRequestComponent;
  @ViewChild('cancelRequestComponent')
  cancelRequestComponent: CancelRequestComponent;

  requestRoom: RequestRoomModel;
  statusChange: Lookup[] = [];
  snackList: InventoryModel[] = [];
  previousStatus: Lookup;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestRoomService: RequestRoomService,
              private inventoryService: InventoryService,
              private toastrService: ToastrService,
              private userSessionService: UserSessionService,
              private fb: FormBuilder,
              private requestService: RequestService) {
    const [,,part] = this.router.url.split('/', 3);
    this.urlRedirectBack = `/dashboard/${part}/sala`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Historial'
    });

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
      switchMap(requestRoom => this.requestRoomService.getStatusByStatusCurrent(requestRoom.request.status.code))
    ).subscribe(status => {
      if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
        this.dataRecepcionist(status);
      } else {
        this.statusChange = status
      }
    });
  }

  changeStatus(status: Lookup): void {
    this.requestRoom.request.statusId = status.id;
    this.requestRoom.request.status = status;

    if (status.code === StatusRequestLookup[StatusRequestLookup.APPROVED]) {
      this.toastrService.info('Puedes asignar snacks a la solicitud', 'Información');
    } else if (status.code === StatusRequestLookup[StatusRequestLookup.CANCELLED]) {
      this.toastrService.info('Agrega un comentario para cancelar la solicitud', 'Información');
    } else if (status.code === StatusRequestLookup[StatusRequestLookup.PROPOSAL]) {
      this.toastrService.info('Agrega las fechas y horarios de la propuesta', 'Información');
    }
  }

  save(): void {
    if (this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.APPROVED] &&
      (this.previousStatus.code === StatusRequestLookup[StatusRequestLookup.NEW] ||
        this.previousStatus.code === StatusRequestLookup[StatusRequestLookup.IN_REVIEW])) {
      this.approveRequest();
      return;
    }

    if (this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.CANCELLED] &&
      this.previousStatus.code === StatusRequestLookup[StatusRequestLookup.APPROVED]) {
      this.cancelRequest();
      return;
    }

    if (this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.PROPOSAL] &&
      this.previousStatus.code === StatusRequestLookup[StatusRequestLookup.NEW]) {
      this.proposalRequest();
      return;
    }

    if (this.previousStatus.code === StatusRequestLookup[StatusRequestLookup.PROPOSAL] &&
      this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.REJECTED]) {
      this.responseRejectRequest();
      return;
    }

    if (this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.WITHOUT_ATTENDING] &&
      this.previousStatus.code === StatusRequestLookup[StatusRequestLookup.APPROVED]) {
      this.withoutAttendingRequest();
      return;
    }
  }

  prepareDataToAssignSnack(inventories: InventoryModel[]): { requestId: number, inventoryRequest: InventoryRequestModel[] } {
    let snacks: InventoryRequestModel[] = [];
    inventories.forEach(inventory => {
      snacks.push(inventory.inventoryRequest);
    });
    return { requestId: this.requestRoom.requestId, inventoryRequest: snacks };
  }

  private dataRecepcionist(status: Lookup[]): void {
    this.inventoryService.findAllSnacks().pipe(
      delay(0),
      tap(snackList => this.snackList = snackList),
      switchMap(() => {
        return (this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.NEW])
          ? this.requestRoomService.availableRoom(this.requestRoom.request)
          : of({isAvailable: true});
      }),
      tap(({isAvailable}) => {
        if (!isAvailable) {
          const index = status.findIndex(status => status.code === StatusRequestLookup[StatusRequestLookup.APPROVED]);
          status.splice(index, 1);
        }

        this.statusChange = status;
      })
    ).subscribe();
  }

  private approveRequest(): void {
    if (this.snackDetailComponent?.snacks.length > 0) {
      const snacks = this.snackDetailComponent?.snacks;
      this.requestRoomService.assignSnacks(this.prepareDataToAssignSnack(snacks))
        .subscribe(() => {
          this.toastrService.success('Solicitud aprobada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        });
    } else {
      this.toastrService.info('No hay ningún snack asignado', 'Información');
    }
  }

  private cancelRequest(): void {
    if (this.cancelRequestComponent.form.invalid) {
      this.cancelRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: RequestModel = this.cancelRequestComponent.form.getRawValue();
    this.requestRoomService.cancelRequest(this.requestRoom.requestId, data).subscribe(() => {
      this.toastrService.success('Solicitud cancelada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private proposalRequest(): void {
    if (this.proposalRequestComponent.form.invalid) {
      this.proposalRequestComponent.form.markAllAsTouched();
      return;
    }

    const { date1, schedule1, date2, schedule2 } = this.proposalRequestComponent.form.getRawValue();
    const dates1 = this.proposalRequestComponent.availableScheduleDate1[schedule1];
    const dates2 = this.proposalRequestComponent.availableScheduleDate2[schedule2];
    const data = {
      startDate1: `${getDateFormat(date1)} ${dates1['startTime']}`,
      endDate1: `${getDateFormat(date1)} ${dates1['endTime']}`,
      startDate2: `${getDateFormat(date2)} ${dates2['startTime']}`,
      endDate2: `${getDateFormat(date2)} ${dates2['endTime']}`,
    };

    this.requestRoomService.proposalRequest(this.requestRoom.requestId, data).subscribe(() => {
      this.toastrService.success('Propuesta enviada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  public responseRejectRequest(proposalRequest?: ProposalRequestModel): void {
    const status = <Lookup> {
      code: (proposalRequest)
        ? StatusRequestLookup[StatusRequestLookup.IN_REVIEW]
        : this.requestRoom.request.status.code
    };
    let data = <RequestModel> { status };

    if (proposalRequest) {
      if (typeof proposalRequest.startDate !== "string") {
        data.startDate = `${getDateFormat(proposalRequest.startDate)} ${getTimeFormat(proposalRequest.startDate)}`;
      }
      if (typeof proposalRequest.endDate !== "string") {
        data.endDate = `${getDateFormat(proposalRequest.endDate)} ${getTimeFormat(proposalRequest.endDate)}`;
      }
    }

    this.requestService.responseRejectRequest(this.requestRoom.requestId, data)
      .subscribe(() => {
        if (this.requestRoom.request.status.code === StatusRequestLookup[StatusRequestLookup.REJECTED]) {
          this.toastrService.success('Solicitud rechazada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        } else {
          this.toastrService.success('Propuesta aceptada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        }
      });
  }

  private withoutAttendingRequest(): void {
    this.requestRoomService.withoutAttendingRequest(this.requestRoom.requestId).subscribe(() => {
      this.toastrService.success('Reunión sin asistir', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }
}
