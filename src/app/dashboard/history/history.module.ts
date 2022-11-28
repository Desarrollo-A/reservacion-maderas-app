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
import { ImageModule } from "../../shared/pipes/image/image.module";
import { DeleteConfirmModule } from "../../shared/components/delete-confirm/delete-confirm.module";
import { ProposalRequestComponent } from './components/proposal-request/proposal-request.component';
import { CancelRequestComponent } from './components/cancel-request/cancel-request.component';
import { ConfirmProposalComponent } from './components/confirm-proposal/confirm-proposal.component';
import { PhoneRequestModule } from "../../shared/components/phone-request/phone-request.module";
import { EmailRequestModule } from "../../shared/components/email-request/email-request.module";
import { ScoreRequestComponent } from './components/score-request/score-request.component';
import { PackageComponent } from './pages/package/package.component';
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';
import { AddressModule } from "../../shared/components/address/address.module";


@NgModule({
  declarations: [
    RoomComponent,
    RoomDetailComponent,
    SnackDetailComponent,
    SnackAssignComponent,
    ProposalRequestComponent,
    CancelRequestComponent,
    ConfirmProposalComponent,
    ScoreRequestComponent,
    PackageComponent,
    PackageDetailComponent
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
    ImageModule,
    DeleteConfirmModule,
    PhoneRequestModule,
    EmailRequestModule,
    AddressModule
  ]
})
export class HistoryModule { }
