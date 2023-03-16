import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RequestDriverService } from "../../../../core/services/request-driver.service";
import { Lookup } from "../../../../core/interfaces/lookup";
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { trackById } from "../../../../shared/utils/track-by";
import { RequestDriverModel } from "../../../../core/models/request-driver.model";
import { CancelRequestComponent } from "../../components/cancel-request/cancel-request.component";
import { TransferRequestComponent } from "../../components/transfer-request/transfer-request.component";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { switchMap, tap } from "rxjs";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { OfficeModel } from "../../../../core/models/office.model";
import { OfficeService } from "../../../../core/services/office.service";
import { DriverRequestAssignComponent } from "../../components/driver-request-assign/driver-request-assign.component";
import { ApprovedDriverRequest } from "../../interfaces/approved-driver-request";
import { ErrorResponse } from 'src/app/core/interfaces/error-response';
import { MatDialog } from "@angular/material/dialog";
import {
  ProposalRequestDriverComponent
} from "../../components/proposal-request-driver/proposal-request-driver.component";
import { InputDataProposalDriverRequest } from "../../interfaces/input-data-proposal-driver-request";
import { RequestModel } from "../../../../core/models/request.model";
import { StatusDriverRequestLookup } from "../../../../core/enums/lookups/status-driver-request.lookup";
import { UserSessionService } from "../../../../core/services/user-session.service";

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class DriverDetailComponent {
  @ViewChild('cancelRequestComponent')
  cancelRequestComponent: CancelRequestComponent;
  @ViewChild('transferRequestComponent')
  transferRequestComponent: TransferRequestComponent;
  @ViewChild('driverRequestAssignComponent')
  driverRequestAssignComponent: DriverRequestAssignComponent;

  requestDriver: RequestDriverModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;
  transferOffices: OfficeModel[] = [];

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private requestDriverService: RequestDriverService,
    private toastrService: ToastrService,
    private officeService: OfficeService,
    private dialog: MatDialog,
    private userSessionService: UserSessionService
  ) {
    const [,,part] = this.router.url.split('/', 3);
    this.urlRedirectBack = `/dashboard/${part}/conductor`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Historial'
    });

    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  get statusRequest(): typeof StatusDriverRequestLookup {
    return StatusDriverRequestLookup;
  }

  get isRecepcionist(): boolean {
    return this.userSessionService.isRecepcionist;
  }

  get isApplicant(): boolean {
    return this.userSessionService.isApplicant;
  }

  changeStatus(status: Lookup): void {
    this.requestDriver.request.statusId = status.id;
    this.requestDriver.request.status = status;

    if (status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.CANCELLED]) {
      this.toastrService.info('Agrega un comentario para cancelar la solicitud', 'Información');
    } else if (status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.TRANSFER]) {
      this.loadOfficesForTransfer();
      this.toastrService.info('Selecciona una oficina para transferir la solicitud', 'Información');
    } else if (status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.PROPOSAL]) {
      this.openDialogProposalRequest();
    }
  }

  findByRequestId(requestId: number): void {
    this.requestDriverService.findById(requestId).pipe(
      tap(requestDriver => {
        this.requestDriver = requestDriver;
        this.previousStatus = {... requestDriver.request.status};
      }),
      switchMap(requestDriver => this.requestDriverService.getStatusByStatusCurrent(requestDriver.request.status.code))
    ).subscribe(status => {
      this.statusChange = status;
    }, (error: ErrorResponse) => {
      if (error.code === 404) {
        this.router.navigateByUrl(this.urlRedirectBack);
      }
    });
  }

  save(): void {
    const statusCode = this.requestDriver.request.status.code;

    if (statusCode === StatusDriverRequestLookup[StatusDriverRequestLookup.CANCELLED] &&
      (this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED] ||
        this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.NEW])) {
      this.cancelRequest();

    } else if (statusCode === StatusDriverRequestLookup[StatusDriverRequestLookup.TRANSFER]) {
      this.transferRequest();

    } else if (statusCode === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED] &&
      this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.NEW]) {
      this.approvedRequest();

    } else if ((statusCode === StatusDriverRequestLookup[StatusDriverRequestLookup.REJECTED] ||
        statusCode === StatusDriverRequestLookup[StatusDriverRequestLookup.ACCEPTED]) &&
      this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.PROPOSAL]) {
      this.responseRejectRequest();
    }
  }

  onSubmitFormRedirectBack(): void {
    this.toastrService.success('Datos guardados', 'Proceso exitoso');
    this.router.navigateByUrl(this.urlRedirectBack);
  }

  private cancelRequest(): void {
    if (this.cancelRequestComponent.form.invalid) {
      this.cancelRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: CancelRequestModel = this.cancelRequestComponent.form.getRawValue();
    this.requestDriverService.cancelRequest(this.requestDriver.requestId, data).subscribe(() => {
      this.toastrService.success('Solicitud cancelada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private transferRequest(): void {
    if (this.transferRequestComponent.form.invalid) {
      this.transferRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: {officeId: number} = this.transferRequestComponent.form.getRawValue();
    this.requestDriverService.transferRequest(this.requestDriver.id, data).subscribe(() => {
      this.toastrService.success('Solicitud redirigida', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private approvedRequest(): void {
    if (this.driverRequestAssignComponent.form.invalid) {
      this.driverRequestAssignComponent.form.markAllAsTouched();
      return;
    }

    const formValues = this.driverRequestAssignComponent.form.getRawValue();
    const data: ApprovedDriverRequest = {
      ...formValues,
      requestId: this.requestDriver.requestId,
      requestDriverId: this.requestDriver.id
    };

    this.requestDriverService.approvedRequest(data).subscribe(() => {
      this.toastrService.success('Solicitud aprobada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private openDialogProposalRequest(): void {
    this.requestDriverService.getBusyDaysForProposalCalendar().subscribe(dates => {
      const data: InputDataProposalDriverRequest = {dates, requestDriver: this.requestDriver};

      this.dialog.open(ProposalRequestDriverComponent, {
        width: '750px',
        autoFocus: false,
        data
      })
        .afterClosed()
        .subscribe((hasAction: boolean) => {
          if (!hasAction) {
            this.requestDriver.request.status = {... this.previousStatus};
          } else {
            this.toastrService.success('Propuesta enviada', 'Proceso exitoso');
            this.router.navigateByUrl(this.urlRedirectBack);
          }
        });
    });
  }

  public responseRejectRequest(): void {
    const status = <Lookup> { code: this.requestDriver.request.status.code };
    let data = <RequestModel> { status };

    this.requestDriverService.responseRejectRequest(this.requestDriver.requestId, data)
      .subscribe(() => {
        if (this.requestDriver.request.status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.REJECTED]) {
          this.toastrService.success('Solicitud rechazada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        } else {
          this.toastrService.success('Propuesta aceptada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        }
      });
  }

  private loadOfficesForTransfer(): void {
    this.officeService.getOfficeByStateWithDriverAndCarWithoutOffice(this.requestDriver.officeId,
      this.requestDriver.request.people)
      .subscribe(offices => {
        this.transferOffices = offices;
        if (offices.length === 0) {
          this.toastrService.info('No hay oficinas con choferes y/o vehículos disponibles', 'Información');
        }
      });
  }
}
