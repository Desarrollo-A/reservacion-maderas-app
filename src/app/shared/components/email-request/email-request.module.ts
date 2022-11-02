import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailRequestTableComponent } from './components/email-request-table/email-request-table.component';
import { EmailCreateUpdateComponent } from './components/email-create-update/email-create-update.component';
import { MaterialModule } from "../../../material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PageLayoutModule } from "../page-layout/page-layout.module";
import { SimplePaginatorModule } from "../simple-paginator/simple-paginator.module";


@NgModule({
  declarations: [
    EmailRequestTableComponent,
    EmailCreateUpdateComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    PageLayoutModule,
    SimplePaginatorModule
  ],
  exports: [
    EmailRequestTableComponent
  ]
})
export class EmailRequestModule { }
