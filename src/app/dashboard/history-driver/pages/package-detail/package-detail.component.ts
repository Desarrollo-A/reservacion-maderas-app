import { Component, NgZone, ViewChild } from '@angular/core';
import { Lookup } from 'src/app/core/interfaces/lookup';
import { PackageModel } from 'src/app/core/models/package.model';
import { Breadcrumbs } from 'src/app/shared/components/breadcrumbs/breadcrumbs.model';
import { trackById } from 'src/app/shared/utils/track-by';
import { ActivatedRoute, Router } from "@angular/router";
import { RequestPackageService } from 'src/app/core/services/request-package.service';
import { ErrorResponse } from 'src/app/core/interfaces/error-response';
import { stagger60ms } from 'src/app/shared/animations/stagger.animation';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { ToastrService } from "ngx-toastr";
import { StatusClass } from "../../interfaces/status-class";
import { DeliveredPackageComponent } from "../../components/delivered-package/delivered-package.component";
import { Observable, switchMap } from "rxjs";
import { DeliveredPackageModel } from "../../../../core/models/delivered-package.model";

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
  @ViewChild('deliveredPackageComponent')
  deliveredPackageComponent: DeliveredPackageComponent;

  requestPackage: PackageModel;
  previousStatus: Lookup;
  codeStatusToChange: string;

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  enableCssClass: StatusClass = { button: ['bg-blue-600'], text: []};
  disableCssClass: StatusClass = { button: ['bg-gray-400', 'cursor-pointer'], text: ['text-gray-400'] };
  approvedCssClass: StatusClass = this.enableCssClass;
  onRoadCssClass: StatusClass;
  deliveredCssClass: StatusClass;

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestPackageService: RequestPackageService,
              private toastrService: ToastrService,
              private ngZone: NgZone) {
    this.urlRedirectBack = `/dashboard/historial/paqueteria`;
    this.breadcrumbs.push({
      link: this.urlRedirectBack,
      label: 'Solicitudes'
    });

    this.activatedRoute.params.subscribe(params => {
      this.findByRequestId(params.id);
    });
  }

  get statusRequest(): typeof StatusPackageRequestLookup {
    return StatusPackageRequestLookup;
  }

  changeStatus(statusCode: string): void {
    this.codeStatusToChange = statusCode;

    if (statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.ROAD]) {
      this.onRoadCssClass = this.enableCssClass;
    } else if (statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.DELIVERED]) {
      this.deliveredCssClass = this.enableCssClass;
      this.toastrService.info('Ingresa nombre y firma de la persona que recibió', 'Información');
    }
  }

  save(): void {
    if (this.codeStatusToChange === StatusPackageRequestLookup[StatusPackageRequestLookup.ROAD]
      && this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED]) {
      this.onRoadRequest();
    } else if (this.codeStatusToChange === StatusPackageRequestLookup[StatusPackageRequestLookup.DELIVERED]
      && this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.ROAD]) {
      this.deliveredPackage();
    }
  }

  findByRequestId(requestId: number): void {
    this.requestPackageService.findById(requestId).subscribe(requestPackage => {
      this.requestPackage = requestPackage;
      this.previousStatus = {... requestPackage.request.status};

      this.validateStatusCurrent();
    }, (error: ErrorResponse) => {
      if (error.code === 404) {
        this.router.navigateByUrl(this.urlRedirectBack);
      }
    });
  }

  private validateStatusCurrent(): void {
    if (this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED]) {
      this.onRoadCssClass = this.disableCssClass;
    } else if (this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.ROAD]) {
      this.onRoadCssClass = this.enableCssClass;
      this.deliveredCssClass = this.disableCssClass;
    }
  }

  private onRoadRequest(): void {
    this.requestPackageService.onRoadPackage(this.requestPackage.requestId).subscribe(() => {
      this.toastrService.success('Paquete en camino al destino', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private deliveredPackage(): void {
    if (this.deliveredPackageComponent.form.invalid) {
      this.deliveredPackageComponent.form.markAllAsTouched();
      return;
    }

    if (this.deliveredPackageComponent.signatureComponent.canvaIsEmpty) {
      this.toastrService.warning('La firma es obligatoria', 'Validación');
      return;
    }

    let signatureFile = null;

    this.getSignatureFile().pipe(
      switchMap(signature => {
        signatureFile = signature;

        const formData = this.deliveredPackageComponent.form.getRawValue();
        const data = <DeliveredPackageModel>{
          packageId: this.requestPackage.id,
          nameReceive: formData.nameReceive
        };

        return this.requestPackageService.deliveredPackage(data);
      }),
      switchMap(() => {
        const dataFile = <DeliveredPackageModel> {
          packageId: this.requestPackage.id,
          signatureFile
        };

        return this.requestPackageService.uploadSignature(dataFile);
      })
    ).subscribe(() => {
      this.toastrService.success('Paquete entregado', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private getSignatureFile(): Observable<File> {
    return new Observable<File>(observer => {
      this.deliveredPackageComponent.signatureComponent.canvasRef.nativeElement.toBlob((blob: Blob) => {
        this.ngZone.run(() => {
          const file = new File([blob], "signature.png", {type: "image/png"});
          observer.next(file);
          observer.complete();
        });
      }, 'image/png', 1);
    });
  }
}
