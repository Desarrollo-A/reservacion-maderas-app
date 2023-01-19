import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { MaterialModule } from "../../material/material.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { RoomDetailComponent } from './pages/room-detail/room-detail.component';
import { BreadcrumbsModule } from "../../shared/components/breadcrumbs/breadcrumbs.module";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { SnackDetailComponent } from './components/snack-detail/snack-detail.component';
import { SnackAssignComponent } from './components/snack-assign/snack-assign.component';
import { SimplePaginatorModule } from "../../shared/components/simple-paginator/simple-paginator.module";
import { UrlModule } from "../../shared/pipes/url/url.module";
import { DeleteConfirmModule } from "../../shared/components/delete-confirm/delete-confirm.module";
import { ProposalRequestRoomComponent } from './components/proposal-request-room/proposal-request-room.component';
import { CancelRequestComponent } from './components/cancel-request/cancel-request.component';
import { ConfirmProposalComponent } from './components/confirm-proposal/confirm-proposal.component';
import { PhoneRequestModule } from "../../shared/components/phone-request/phone-request.module";
import { EmailRequestModule } from "../../shared/components/email-request/email-request.module";
import { ScoreRequestComponent } from './components/score-request/score-request.component';
import { PackageComponent } from './pages/package/package.component';
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';
import { AddressModule } from "../../shared/components/address/address.module";
import { DriverPackageAssignComponent } from './components/driver-package-assign/driver-package-assign.component';
import { TransferRequestComponent } from './components/transfer-request/transfer-request.component';
import { DriverComponent } from './pages/driver/driver.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { CarComponent } from './pages/car/car-component';
import { DriverRequestAssignComponent } from './components/driver-request-assign/driver-request-assign.component';
import { CarDetailComponent } from './pages/car-detail/car-detail.component';
import { CarRequestAssignComponent } from './components/car-request-assign/car-request-assign.component';
import { ProposalRequestPackageComponent } from './components/proposal-request-package/proposal-request-package.component';
import { RequestPackaheDriverInfoComponent } from './components/proposal-request-package/request-packahe-driver-info/request-packahe-driver-info.component';
import { ProposalRequestDriverComponent } from './components/proposal-request-driver/proposal-request-driver.component';


@NgModule({
  declarations: [
    RoomComponent,
    RoomDetailComponent,
    SnackDetailComponent,
    SnackAssignComponent,
    ProposalRequestRoomComponent,
    CancelRequestComponent,
    ConfirmProposalComponent,
    ScoreRequestComponent,
    PackageComponent,
    PackageDetailComponent,
    DriverPackageAssignComponent,
    TransferRequestComponent,
    DriverComponent,
    DriverDetailComponent,
    CarComponent,
    DriverRequestAssignComponent,
    CarDetailComponent,
    CarRequestAssignComponent,
    ProposalRequestPackageComponent,
    RequestPackaheDriverInfoComponent,
    ProposalRequestDriverComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    SimplePaginatorModule,
    BreadcrumbsModule,
    PageNotFoundModule,
    UrlModule,
    DeleteConfirmModule,
    PhoneRequestModule,
    EmailRequestModule,
    AddressModule
  ]
})
export class HistoryModule { }
