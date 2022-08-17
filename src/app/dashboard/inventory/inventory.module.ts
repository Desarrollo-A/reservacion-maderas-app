import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PageLayoutModule } from 'src/app/shared/components/page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { ItemCreateUpdateComponent } from './components/item-create-update/item-create-update.component';
import { DeleteConfirmModule } from "../../shared/components/delete-confirm/delete-confirm.module";
import { UpdateStockComponent } from './components/update-stock/update-stock.component';
import { ImageModule } from "../../shared/pipes/image/image.module";
import { UpdateImageComponent } from './components/update-image/update-image.component';
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { BreadcrumbsModule } from 'src/app/shared/components/breadcrumbs/breadcrumbs.module';


@NgModule({
  declarations: [
    InventoryComponent,
    ItemCreateUpdateComponent,
    UpdateStockComponent,
    UpdateImageComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    DeleteConfirmModule,
    ImageModule,
    PageNotFoundModule,
    BreadcrumbsModule
  ]
})
export class InventoryModule { }
