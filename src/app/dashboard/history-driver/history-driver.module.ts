import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryDriverRoutingModule } from './history-driver-routing.module';
import { PackageComponent } from './pages/package/package.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PageLayoutModule } from 'src/app/shared/components/page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'src/app/shared/components/paginator/paginator.module';
import { BreadcrumbsModule } from 'src/app/shared/components/breadcrumbs/breadcrumbs.module';
import { PageNotFoundModule } from 'src/app/shared/components/page-not-found/page-not-found.module';
import { DriverComponent } from './pages/driver/driver.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { AddressModule } from 'src/app/shared/components/address/address.module';
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';
import { DeliveredPackageComponent } from './components/delivered-package/delivered-package.component';
import { SignatureModule } from "../../shared/components/signature/signature.module";

@NgModule({
  declarations: [
    PackageComponent,
    DriverComponent,
    DriverDetailComponent,
    PackageDetailComponent,
    DeliveredPackageComponent
  ],
  imports: [
    CommonModule,
    HistoryDriverRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    BreadcrumbsModule,
    PageNotFoundModule,
    AddressModule,
    SignatureModule
  ]
})
export class HistoryDriverModule { }
