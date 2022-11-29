import { Component, ViewChild } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { PackageModel } from "../../../../core/models/package.model";
import { Lookup } from "../../../../core/interfaces/lookup";
import { switchMap, tap } from "rxjs";
import { trackById } from "../../../../shared/utils/track-by";
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { CancelRequestComponent } from "../../components/cancel-request/cancel-request.component";
import { StatusRequestRoomLookup } from "../../../../core/enums/lookups/status-request-room.lookup";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.scss'],
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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestPackageService: RequestPackageService,
              private toastrService: ToastrService) {
    const [,,part] = this.router.url.split('/', 3);
    this.urlRedirectBack = `/dashboard/${part}/paqueteria`;
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
    });
  }

  changeStatus(status: Lookup): void {
    this.requestPackage.request.statusId = status.id;
    this.requestPackage.request.status = status;
  }

  save(): void {
    if (this.requestPackage.request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED] &&
      (this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED] ||
        this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.NEW])) {
      this.cancelRequest();
      return;
    }
  }

  private cancelRequest(): void {
    if (this.cancelRequestComponent.form.invalid) {
      this.cancelRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: CancelRequestModel = this.cancelRequestComponent.form.getRawValue();
    this.requestPackageService.cancelRequest(this.requestPackage.requestId, data).subscribe(() => {
      this.toastrService.success('Solicitud cancelada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }
}
