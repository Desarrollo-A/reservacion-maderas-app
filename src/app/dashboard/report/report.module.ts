import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './pages/report/report.component';
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    PageNotFoundModule
  ]
})
export class ReportModule { }
