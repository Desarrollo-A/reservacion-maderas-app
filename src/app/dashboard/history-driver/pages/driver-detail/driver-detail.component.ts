import { Component } from '@angular/core';
import { RequestDriverModel } from 'src/app/core/models/request-driver.model';
import { Breadcrumbs } from 'src/app/shared/components/breadcrumbs/breadcrumbs.model';
import { trackById } from 'src/app/shared/utils/track-by';
import { ActivatedRoute, Router } from "@angular/router";
import { RequestDriverService } from 'src/app/core/services/request-driver.service';
import { ErrorResponse } from 'src/app/core/interfaces/error-response';
import { stagger60ms } from 'src/app/shared/animations/stagger.animation';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';

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

  requestDriver: RequestDriverModel;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestDriverService: RequestDriverService) {
    this.urlRedirectBack = `/dashboard/historial/conductor`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Solicitudes'
    });

    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  findByRequestId(requestId: number): void {
    this.requestDriverService.findById(requestId).subscribe(requestDriver => {
        this.requestDriver = requestDriver;
    }, (error: ErrorResponse) => {
      if (error.code === 404) {
        this.router.navigateByUrl(this.urlRedirectBack);
      }
    });
  }
}
