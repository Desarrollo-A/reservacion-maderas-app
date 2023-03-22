import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryManagerRoutingModule } from './history-manager-routing.module';
import { PackageListComponent } from './pages/package-list/package-list.component';
import { MaterialModule } from "../../material/material.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { BreadcrumbsModule } from "../../shared/components/breadcrumbs/breadcrumbs.module";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';


@NgModule({
  declarations: [
    PackageListComponent,
    PackageDetailComponent
  ],
  imports: [
    CommonModule,
    HistoryManagerRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    BreadcrumbsModule,
    PageNotFoundModule
  ]
})
export class HistoryManagerModule { }
