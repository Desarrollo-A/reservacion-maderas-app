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

@NgModule({
  declarations: [
    PackageComponent
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
    PageNotFoundModule
  ]
})
export class HistoryDriverModule { }
