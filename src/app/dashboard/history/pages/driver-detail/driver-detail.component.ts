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
import { StatusDriverRequestLookup } from "../../../../core/enums/lookups/status-driver-request.lookup";
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { switchMap, tap } from "rxjs";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { OfficeModel } from "../../../../core/models/office.model";
import { OfficeService } from "../../../../core/services/office.service";
import { DriverRequestAssignComponent } from "../../components/driver-request-assign/driver-request-assign.component";
import { ApprovedDriverRequest } from "../../interfaces/approved-driver-request";
import { ErrorResponse } from 'src/app/core/interfaces/error-response';

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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestDriverService: RequestDriverService,
              private toastrService: ToastrService,
              private officeService: OfficeService) {
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

  changeStatus(status: Lookup): void {
    this.requestDriver.request.statusId = status.id;
    this.requestDriver.request.status = status;

    if (status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.CANCELLED]) {
      this.toastrService.info('Agrega un comentario para cancelar la solicitud', 'Información');
    } else if (status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.TRANSFER]) {
      this.loadOfficesForTransfer();
      this.toastrService.info('Selecciona una oficina para transferir la solicitud', 'Información');
    } else if (status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED]) {
      this.toastrService.info('Selecciona un chofer y un vehículo', 'Información');
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
    if (this.requestDriver.request.status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.CANCELLED] &&
      (this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED] ||
        this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.NEW])) {
      this.cancelRequest();

    } else if (this.requestDriver.request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.TRANSFER]) {
      this.transferRequest();

    } else if (this.requestDriver.request.status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED] &&
      this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.NEW]) {
      this.approvedRequest();
    }
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

  public approvedRequest(): void {
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
