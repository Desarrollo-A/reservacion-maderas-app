import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PageLayoutModule } from 'src/app/shared/components/page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InventoryComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InventoryModule { }
