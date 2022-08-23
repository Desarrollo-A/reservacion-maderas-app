import { Component, OnInit, ViewChild } from '@angular/core';
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestRoomService } from "../../../request/services/request-room.service";
import { RequestRoomModel } from "../../../request/models/request-room.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { of, switchMap, tap } from "rxjs";
import { InventoryService } from "../../../inventory/services/inventory.service";
import { InventoryModel } from "../../../inventory/models/inventory.model";
import { StatusRequestLookup } from "../../enums/status-request.lookup";
import { SnackDetailComponent } from "../../components/snack-detail/snack-detail.component";
import { InventoryRequestModel } from "../../models/inventory-request.model";
import { ToastrService } from "ngx-toastr";
import { UserSessionService } from "../../../../core/services/user-session.service";
import { NameRole } from "../../../../core/enums/name-role";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "../../../../shared/utils/form-error";
import { RequestModel } from "../../../request/models/request.model";

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class RoomDetailComponent implements OnInit {
  @ViewChild('snackDetailComponent')
  snackDetailComponent: SnackDetailComponent;

  requestRoom: RequestRoomModel;
  statusChange: Lookup[] = [];
  snackList: InventoryModel[] = [];
  previousStatus: Lookup;

  cancelForm: FormGroup;
  cancelFormErrors: FormErrors;

  breadcrumbs: Breadcrumbs[] = [
    { link: '/dashboard/historial/sala', label: 'Historial' }
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestRoomService: RequestRoomService,
              private inventoryService: InventoryService,
              private toastrService: ToastrService,
              private userSessionService: UserSessionService,
              private fb: FormBuilder) {
    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  ngOnInit(): void {
    this.cancelForm = this.fb.group({
      cancelComment: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
    this.cancelFormErrors = new FormErrors(this.cancelForm);
  }

  get statusRequest(): typeof StatusRequestLookup {
    return StatusRequestLookup;
  }

  findByRequestId(requestId: number): void {
    this.requestRoomService.findByRequestId(requestId).pipe(
      tap(requestRoom => {
        this.requestRoom = requestRoom;
        this.previousStatus = {... requestRoom.request.status};
        if (this.previousStatus.name === StatusRequestLookup.CANCELLED) {
          this.cancelForm.get('cancelComment').setValue(requestRoom.request.cancelComment);
          this.cancelForm.get('cancelComment').clearValidators();
        }
      }),
      switchMap(requestRoom => this.requestRoomService.getStatusByStatusCurrent(requestRoom.request.status.name))
    ).subscribe(status => {
      this.statusChange = status

      if (this.userSessionService.user.role.name === NameRole.RECEPCIONIST) {
        this.inventoryService.findAllSnacks().pipe(
          tap(snackList => this.snackList = snackList),
          switchMap(() => {
            return (this.requestRoom.request.status.name === StatusRequestLookup.NEW)
              ? this.requestRoomService.availableRoom(this.requestRoom.request)
              : of({isAvailable: true});

          })
        ).subscribe(({isAvailable}) => {
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
    if (this.requestRoom.request.statusName === StatusRequestLookup.APPROVED &&
      this.previousStatus.name === StatusRequestLookup.NEW) {
      this.approveRequest();
      return;
    }

    if (this.requestRoom.request.statusName === StatusRequestLookup.CANCELLED &&
      this.previousStatus.name === StatusRequestLookup.APPROVED) {
      this.cancelRequest();
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

  private approveRequest(): void {
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

  private cancelRequest(): void {
    if (this.cancelForm.invalid) {
      this.cancelForm.markAllAsTouched();
      return;
    }

    const data: RequestModel = this.cancelForm.getRawValue();
    this.requestRoomService.cancelRequest(this.requestRoom.requestId, data).subscribe(() => {
      this.toastrService.success('Solicitud cancelada', 'Proceso exitoso');
      this.router.navigateByUrl('/dashboard/historial/sala');
    });
  }
}
