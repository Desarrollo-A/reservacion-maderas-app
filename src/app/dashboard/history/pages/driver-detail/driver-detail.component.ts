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

  requestDriver: RequestDriverModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestDriverService: RequestDriverService,
              private toastrService: ToastrService) {
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
    });
  }

  save(): void {
    if (this.requestDriver.request.status.code === StatusDriverRequestLookup[StatusDriverRequestLookup.CANCELLED] &&
      (this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.APPROVED] ||
        this.previousStatus.code === StatusDriverRequestLookup[StatusDriverRequestLookup.NEW])) {
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
    this.requestDriverService.cancelRequest(this.requestDriver.requestId, data).subscribe(() => {
      this.toastrService.success('Solicitud cancelada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }
}