import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { PackageModel } from 'src/app/core/models/package.model';
import { ProposalRequestModel } from 'src/app/core/models/proposal-request.model';
import { Breadcrumbs } from 'src/app/shared/components/breadcrumbs/breadcrumbs.model';
import { TableColumn } from 'src/app/shared/interfaces/table-column.interface';
import { trackById } from 'src/app/shared/utils/track-by';
import { ActivatedRoute, Router } from "@angular/router";
import { RequestPackageService } from 'src/app/core/services/request-package.service';
import { switchMap, tap } from "rxjs";
import { ErrorResponse } from 'src/app/core/interfaces/error-response';
import { stagger60ms } from 'src/app/shared/animations/stagger.animation';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';


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
  requestPackage: PackageModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestPackageService: RequestPackageService,) {
    const [,,part] = this.router.url.split('/', 3);
    this.urlRedirectBack = `/dashboard/${part}/paqueteria`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Solicitudes'
    });

    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
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
}
