import { NgModule } from '@angular/core';
import { PaginatorComponent } from './paginator.component';
import { MaterialModule } from "../../../material/material.module";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { TranslatePaginator } from "./translate-paginator";

@NgModule({
  declarations: [
    PaginatorComponent
  ],
  imports: [
    MaterialModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TranslatePaginator }
  ]
})
export class PaginatorModule { }
