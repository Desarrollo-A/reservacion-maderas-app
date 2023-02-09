import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { InputOutputInventoryComponent } from './pages/input-output-inventory/input-output-inventory.component';
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { MaterialModule } from "../../material/material.module";
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbsModule } from "../../shared/components/breadcrumbs/breadcrumbs.module";
import { InputOutputInventoryConfigComponent } from './components/input-output-inventory-config/input-output-inventory-config.component';
import { PackageComponent } from './pages/package/package.component';
import { PackageConfigComponent } from './components/package-config/package-config.component';


@NgModule({
  declarations: [
    InputOutputInventoryComponent,
    InputOutputInventoryConfigComponent,
    PackageComponent,
    PackageConfigComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    MaterialModule,
    PaginatorModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundModule,
    BreadcrumbsModule
  ]
})
export class ReportModule { }
