import { Component, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { CancelRequestComponent } from "../../../history/components/cancel-request/cancel-request.component";
import { PackageModel } from "../../../../core/models/package.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { trackById } from "../../../../shared/utils/track-by";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { ToastrService } from "ngx-toastr";
import { switchMap, tap } from "rxjs";
import { ErrorResponse } from "../../../../core/interfaces/error-response";
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { RequestModel } from "../../../../core/models/request.model";

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class PackageDetailComponent {
  @ViewChild('cancelRequestComponent')
  cancelRequestComponent: CancelRequestComponent;

  requestPackage: PackageModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private requestPackageService: RequestPackageService,
    private toastrService: ToastrService
  ) {
    this.urlRedirectBack = `/dashboard/director/solicitudes/paqueteria`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Historial'
    });

    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  get statusRequest(): typeof StatusPackageRequestLookup {
    return StatusPackageRequestLookup;
  }

  findByRequestId(requestId: number): void {
    this.requestPackageService.findById(requestId).pipe(
      tap(requestPackage => {
        this.requestPackage = requestPackage;
        this.previousStatus = {... requestPackage.request.status};
      }),
      switchMap(requestPackage => this.requestPackageService.getStatusByStatusCurrent(requestPackage.request.status.code))
    ).subscribe(status => {
      this.statusChange = status;
    }, (error: ErrorResponse) => {
      if (error.code === 404) {
        this.router.navigateByUrl(this.urlRedirectBack)
      }
    });
  }

  changeStatus(status: Lookup): void {
    this.requestPackage.request.statusId = status.id;
    this.requestPackage.request.status = status;

    if (status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED]) {
      this.toastrService.info('Agrega un comentario para cancelar la solicitud', 'Información');
    }
  }

  save(): void {
    const statusCode = this.requestPackage.request.status.code;

    if (
      statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.ACCEPT] ||
      statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED]
    ) {
      this.acceptOrCancelRequest();
    }
  }

  private acceptOrCancelRequest(): void {
    let cancelRequest: CancelRequestModel;
    if (this.requestPackage.request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED]) {
      if (this.cancelRequestComponent.form.invalid) {
        this.cancelRequestComponent.form.markAllAsTouched();
        return;
      }

      cancelRequest = this.cancelRequestComponent.form.getRawValue();
    }

    const request: RequestModel = <RequestModel> {
      status: this.requestPackage.request.status,
      cancelRequest
    };

    this.requestPackageService.acceptCancelPackage(this.requestPackage.requestId, request).subscribe(() => {
      if (request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.ACCEPT]) {
        this.toastrService.success('Solicitud aceptada','Proceso exitoso');
      } else if (request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED]) {
        this.toastrService.success('Solicitud cancelada','Proceso exitoso');
      }

      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }
}
