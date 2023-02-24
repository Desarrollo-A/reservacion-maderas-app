import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeListComponent } from './pages/office-list/office-list.component';
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { MaterialModule } from "../../material/material.module";
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "@angular/cdk/layout";
import { SidenavModule } from "../../shared/layout/sidenav/sidenav.module";
import { ToolbarModule } from "../../shared/layout/toolbar/toolbar.module";
import { BreadcrumbsModule } from "../../shared/components/breadcrumbs/breadcrumbs.module";
import { OfficeCreateUpdateComponent } from './components/office-create-update/office-create-update.component';


@NgModule({
  declarations: [
    OfficeListComponent,
    OfficeCreateUpdateComponent
  ],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    PageNotFoundModule,
    MaterialModule,
    PaginatorModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    SidenavModule,
    ToolbarModule,
    BreadcrumbsModule
  ]
})
export class OfficeModule { }
