import { Component, OnInit } from '@angular/core';
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
  requestCar: RequestCarModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestCarService: RequestCarService,
              private toastrService: ToastrService) {
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
    //
  }

  findByRequestId(requestId: number): void {
    this.requestCarService.findByRequestId(requestId).subscribe(requestCar => {
      this.requestCar = requestCar;
      this.previousStatus = {... requestCar.request.status};
    }, (error: ErrorResponse) => {
      if (error.code === 404) {
        this.router.navigateByUrl(this.urlRedirectBack);
      }
    });
  }

  save(): void {
    //
  }
}
