import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { RoomComponent } from './pages/room/room.component';
import { CarComponent } from './pages/car/car.component';
import { DriverComponent } from './pages/driver/driver.component';
import { MaterialModule } from "../../material/material.module";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaginatorModule } from "../../shared/components/paginator/paginator.module";
import { RoomDetailComponent } from './pages/room-detail/room-detail.component';
import { BreadcrumbsModule } from "../../shared/components/breadcrumbs/breadcrumbs.module";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { SnackDetailComponent } from './components/snack-detail/snack-detail.component';
import { SnackAssignComponent } from './components/snack-assign/snack-assign.component';
import { SimplePaginatorModule } from "../../shared/components/simple-paginator/simple-paginator.module";
import { ImageModule } from "../../shared/pipes/image/image.module";


@NgModule({
  declarations: [
    RoomComponent,
    CarComponent,
    DriverComponent,
    RoomDetailComponent,
    SnackDetailComponent,
    SnackAssignComponent
  ],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    MaterialModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    SimplePaginatorModule,
    BreadcrumbsModule,
    PageNotFoundModule,
    ImageModule
  ]
})
export class HistoryModule { }
