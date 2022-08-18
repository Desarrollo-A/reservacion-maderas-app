import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplePaginatorComponent } from "./simple-paginator.component";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { TranslatePaginator } from "../../utils/translate-paginator";
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [
    SimplePaginatorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    SimplePaginatorComponent
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: TranslatePaginator}
  ]
})
export class SimplePaginatorModule { }
