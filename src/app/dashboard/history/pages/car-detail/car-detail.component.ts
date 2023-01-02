import { Component, OnInit, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { RequestCarModel } from "../../../../core/models/request-car.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { trackById } from "../../../../shared/utils/track-by";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestCarService } from "../../../../core/services/request-car.service";
import { ToastrService } from "ngx-toastr";
import { ErrorResponse } from "../../../../core/interfaces/error-response";
import { StatusCarRequestLookup } from "../../../../core/enums/lookups/status-car-request.lookup";
import { OfficeModel } from "../../../../core/models/office.model";
import { OfficeService } from "../../../../core/services/office.service";
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { TransferRequestComponent } from "../../components/transfer-request/transfer-request.component";
import { switchMap, tap } from "rxjs";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { CancelRequestComponent } from "../../components/cancel-request/cancel-request.component";
import { CarRequestAssignComponent } from "../../components/car-request-assign/car-request-assign.component";
import { ApprovedCarRequest } from "../../interfaces/approved-car-request";

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class CarDetailComponent implements OnInit {
  @ViewChild('transferRequestComponent')
  transferRequestComponent: TransferRequestComponent;
  @ViewChild('cancelRequestComponent')
  cancelRequestComponent: CancelRequestComponent;
  @ViewChild('carRequestAssignComponent')
  carRequestAssignComponent: CarRequestAssignComponent;

  requestCar: RequestCarModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;
  transferOffices: OfficeModel[] = [];

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestCarService: RequestCarService,
              private toastrService: ToastrService,
              private officeService: OfficeService) {
    const [,,part] = this.router.url.split('/', 3);
    this.urlRedirectBack = `/dashboard/${part}/automovil`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Historial'
    });

    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  ngOnInit(): void {
  }

  get statusRequest(): typeof StatusCarRequestLookup {
    return StatusCarRequestLookup;
  }

  changeStatus(status: Lookup): void {
    this.requestCar.request.statusId = status.id;
    this.requestCar.request.status = status;

    if (status.code === StatusCarRequestLookup[StatusCarRequestLookup.TRANSFER]) {
      this.loadOfficesForTransfer();
      this.toastrService.info('Selecciona una oficina para transferir la solicitud', 'Información');
    } else if (status.code === StatusCarRequestLookup[StatusCarRequestLookup.CANCELLED]) {
      this.toastrService.info('Agrega un comentario para cancelar la solicitud', 'Información');
    } else if (status.code === StatusCarRequestLookup[StatusCarRequestLookup.APPROVED]) {
      this.toastrService.info('Selecciona un automóvil', 'Información');
    }
  }

  findByRequestId(requestId: number): void {
    this.requestCarService.findByRequestId(requestId).pipe(
      tap(requestCar => {
        this.requestCar = requestCar;
        this.previousStatus = {... requestCar.request.status};
      }),
      switchMap(requestCar => this.requestCarService.getStatusByStatusCurrent(requestCar.request.status.code))
    ).subscribe(status => {
      this.statusChange = status;
    }, (error: ErrorResponse) => {
      if (error.code === 404) {
        this.router.navigateByUrl(this.urlRedirectBack);
      }
    });
  }

  save(): void {
    if (this.requestCar.request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.TRANSFER]) {
      this.transferRequest();

    } else if (this.requestCar.request.status.code === StatusCarRequestLookup[StatusCarRequestLookup.CANCELLED] &&
      (this.previousStatus.code === StatusCarRequestLookup[StatusCarRequestLookup.APPROVED] ||
        this.previousStatus.code === StatusCarRequestLookup[StatusCarRequestLookup.NEW])) {
      this.cancelRequest();

    } else if (this.requestCar.request.status.code === StatusCarRequestLookup[StatusCarRequestLookup.APPROVED] &&
    this.previousStatus.code === StatusCarRequestLookup[StatusCarRequestLookup.NEW]) {
      this.approvedRequest();
    }
  }

  private transferRequest(): void {
    if (this.transferRequestComponent.form.invalid) {
      this.transferRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: {officeId: number} = this.transferRequestComponent.form.getRawValue();
    this.requestCarService.transferRequest(this.requestCar.id, data).subscribe(() => {
      this.toastrService.success('Solicitud redirigida', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private cancelRequest(): void {
    if (this.cancelRequestComponent.form.invalid) {
      this.cancelRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: CancelRequestModel = this.cancelRequestComponent.form.getRawValue();
    this.requestCarService.cancelRequest(this.requestCar.requestId, data).subscribe(() => {
      this.toastrService.success('Solicitud cancelada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  public approvedRequest(): void {
    if (this.carRequestAssignComponent.form.invalid) {
      this.carRequestAssignComponent.form.markAllAsTouched();
      return;
    }

    const formValues = this.carRequestAssignComponent.form.getRawValue();
    const data: ApprovedCarRequest = {
      ...formValues,
      requestId: this.requestCar.requestId,
      requestCarId: this.requestCar.id
    };

    this.requestCarService.approvedRequest(data).subscribe(() => {
      this.toastrService.success('Solicitud aprobada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private loadOfficesForTransfer(): void {
    this.officeService.getOfficeByStateWithCarWithoutOffice(this.requestCar.officeId, this.requestCar.request.people)
      .subscribe(offices => {
        this.transferOffices = offices;
        if (offices.length === 0) {
          this.toastrService.info('No hay oficinas con vehículos disponibles', 'Información');
        }
      });
  }
}