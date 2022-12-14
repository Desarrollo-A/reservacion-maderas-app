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

  findByRequestId(requestId: number): void {
    this.requestDriverService.findById(requestId).subscribe(requestDriver => {
      this.requestDriver = requestDriver;
    });
  }
}
