import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeavyShippingTableComponent } from './heavy-shipping-table.component';
import { MaterialModule } from "../../../material/material.module";
import { PageLayoutModule } from "../page-layout/page-layout.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SimplePaginatorModule } from "../simple-paginator/simple-paginator.module";
import { HeavyShippingDetailComponent } from './heavy-shipping-detail/heavy-shipping-detail.component';



@NgModule({
  declarations: [
    HeavyShippingTableComponent,
    HeavyShippingDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PageLayoutModule,
    ReactiveFormsModule,
    SimplePaginatorModule
  ],
  exports: [
    HeavyShippingTableComponent
  ]
})
export class HeavyShippingTableModule { }
