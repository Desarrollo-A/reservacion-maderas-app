import { Component } from '@angular/core';
import { stagger60ms } from "../../../../shared/animations/stagger.animation";
import { fadeInUp400ms } from "../../../../shared/animations/fade-in-up.animation";
import { Breadcrumbs } from "../../../../shared/components/breadcrumbs/breadcrumbs.model";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestPackageService } from "../../../../core/services/request-package.service";
import { PackageModel } from "../../../../core/models/package.model";

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

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestPackageService: RequestPackageService) {
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

  findByRequestId(requestId: number): void {
    this.requestPackageService.findById(requestId).subscribe(requestPackage => {
      this.requestPackage = requestPackage;
    });
  }
}
