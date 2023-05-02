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
import { CancelRequestComponent } from "../../components/cancel-request/cancel-request.component";
import { CancelRequestModel } from "../../../../core/models/cancel-request.model";
import { ToastrService } from "ngx-toastr";
import { TransferRequestComponent } from "../../components/transfer-request/transfer-request.component";
import { DriverPackageAssignComponent } from "../../components/driver-package-assign/driver-package-assign.component";
import { ApprovedPackageRequest } from "../../interfaces/approved-package-request";
import { getDateFormat } from "../../../../shared/utils/utils";
import { StatusPackageRequestLookup } from "../../../../core/enums/lookups/status-package-request.lookup";
import { OfficeModel } from "../../../../core/models/office.model";
import { OfficeService } from "../../../../core/services/office.service";
import { ErrorResponse } from 'src/app/core/interfaces/error-response';
import { MatDialog } from "@angular/material/dialog";
import {
  ProposalRequestPackageComponent
} from "../../components/proposal-request-package/proposal-request-package.component";
import { MatTableDataSource } from "@angular/material/table";
import { ProposalRequestModel } from "../../../../core/models/proposal-request.model";
import { TableColumn } from "../../../../shared/interfaces/table-column.interface";
import { ConfirmProposalComponent } from "../../components/confirm-proposal/confirm-proposal.component";
import { RequestModel } from "../../../../core/models/request.model";
import { UserSessionService } from "../../../../core/services/user-session.service";

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
  @ViewChild('transferRequestComponent')
  transferRequestComponent: TransferRequestComponent;
  @ViewChild('driverPackageAssignComponent')
  driverPackageAssignComponents: DriverPackageAssignComponent;

  requestPackage: PackageModel;
  statusChange: Lookup[] = [];
  previousStatus: Lookup;
  transferOffices: OfficeModel[] = [];

  breadcrumbs: Breadcrumbs[] = [];
  urlRedirectBack = '';

  proposalDataSource = new MatTableDataSource<ProposalRequestModel>();
  columns: TableColumn<ProposalRequestModel>[] = [
    {label: 'Número', property: 'number', type: 'text', visible: true},
    {label: 'Fecha', property: 'date', type: 'text', visible: true},
    {label: 'Acción', property: 'action', type: 'button', visible: true}
  ];

  trackById = trackById;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestPackageService: RequestPackageService,
              private toastrService: ToastrService,
              private officeService: OfficeService,
              private dialog: MatDialog,
              private userSessionService: UserSessionService) {
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

  get proposalVisibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  get enableProposal(): boolean {
    return this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.PROPOSAL] &&
      this.requestPackage.request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.PROPOSAL] &&
      this.userSessionService.isApplicant;
  }

  findByRequestId(requestId: number): void {
    this.requestPackageService.findById(requestId).pipe(
      tap(requestPackage => {
        this.requestPackage = requestPackage;
        this.previousStatus = {... requestPackage.request.status};
        this.proposalDataSource.data = requestPackage.request.proposalRequest;
      }),
      switchMap(requestPackage => this.requestPackageService.getStatusByStatusCurrent(requestPackage.request.status.code))
    ).subscribe(status => {
      this.statusChange = status;

      this.prepareProposalTableColumns();
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
    } else if (status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.TRANSFER]) {
      this.loadOfficesForTransfer();
      this.toastrService.info('Selecciona una oficina para transferir la solicitud', 'Información');
    } else if (status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED]) {
      if (!this.requestPackage.proposalPackage) {
        this.toastrService.info('Selecciona el método de envío', 'Información');
      }
    } else if (status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.PROPOSAL]) {
      this.dialog.open(ProposalRequestPackageComponent, {
        data: this.requestPackage,
        width: '750px',
        autoFocus: false
      })
        .afterClosed()
        .subscribe((hasAction: boolean) => {
          if (!hasAction) {
            this.requestPackage.request.status = {... this.previousStatus};
          } else {
            this.proposalRequest();
          }
        });
    }
  }

  confirmationProposal(id: number, index: number): void {
    const { proposalRequest } = this.requestPackage.request;
    this.dialog.open(ConfirmProposalComponent, {data: index+1, autoFocus: false})
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          const data = proposalRequest.find(proposal => proposal.id === id);
          this.responseRejectRequest(data);
        }
      });
  }

  save(): void {
    const statusCode = this.requestPackage.request.status.code;

    if (statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.CANCELLED] &&
      (this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED] ||
        this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.NEW])) {
      this.cancelRequest();
    } else if (statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.TRANSFER]) {
      this.transferRequest();
    } else if (statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.APPROVED]
      && (this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.NEW] ||
        this.previousStatus.code === StatusPackageRequestLookup[StatusPackageRequestLookup.IN_REVIEW])) {
      this.approvedRequest();
    } else if (statusCode === StatusPackageRequestLookup[StatusPackageRequestLookup.REJECTED]) {
      this.responseRejectRequest();
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

  private transferRequest(): void {
    if (this.transferRequestComponent.form.invalid) {
      this.transferRequestComponent.form.markAllAsTouched();
      return;
    }

    const data: {officeId: number} = this.transferRequestComponent.form.getRawValue();
    this.requestPackageService.transferRequest(this.requestPackage.id, data).subscribe(() => {
      this.toastrService.success('Solicitud redirigida', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private approvedRequest(): void {
    if (this.driverPackageAssignComponents.form.invalid) {
      this.driverPackageAssignComponents.form.markAllAsTouched();
      return;
    }

    const formValues = this.driverPackageAssignComponents.form.getRawValue();
    if (formValues.endDate) {
      formValues.endDate = getDateFormat(formValues.endDate);
    }
    const data: ApprovedPackageRequest = {
      ...formValues,
      requestId: this.requestPackage.requestId,
      packageId: this.requestPackage.id
    };

    this.requestPackageService.approvedPackageRequest(data).subscribe(() => {
      this.toastrService.success('Solicitud aprobada', 'Proceso exitoso');
      this.router.navigateByUrl(this.urlRedirectBack);
    });
  }

  private proposalRequest(): void {
    this.toastrService.success('Propuesta enviada', 'Proceso exitoso');
    this.router.navigateByUrl(this.urlRedirectBack);
  }

  public responseRejectRequest(proposalRequest?: ProposalRequestModel): void {
    const status = <Lookup> {
      code: (proposalRequest)
        ? StatusPackageRequestLookup[StatusPackageRequestLookup.IN_REVIEW]
        : this.requestPackage.request.status.code
    };
    let data = <RequestModel> { status };

    if (proposalRequest) {
      data.proposalId = proposalRequest.id;
    }

    this.requestPackageService.responseRejectRequest(this.requestPackage.requestId, data)
      .subscribe(() => {
        if (this.requestPackage.request.status.code === StatusPackageRequestLookup[StatusPackageRequestLookup.REJECTED]) {
          this.toastrService.success('Solicitud rechazada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        } else {
          this.toastrService.success('Propuesta aceptada', 'Proceso exitoso');
          this.router.navigateByUrl(this.urlRedirectBack);
        }
      });
  }

  private prepareProposalTableColumns(): void {
    if (!this.requestPackage.proposalPackage) {
      return;
    }

    if (!this.requestPackage.proposalPackage.isDriverSelected) {
      this.columns.splice(2, 0, {
        label: 'Fecha llegada aproximada', property: 'endDate', type: 'text', visible: true
      });
    }
  }

  private loadOfficesForTransfer(): void {
    this.officeService.getByStateWithDriverWithoutOffice(this.requestPackage.officeId)
      .subscribe(offices => {
        this.transferOffices = offices;
        if (offices.length === 0) {
          this.toastrService.info('No hay oficinas con choferes disponibles', 'Información');
        }
      });
  }
}
