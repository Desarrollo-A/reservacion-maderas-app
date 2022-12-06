import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackageRoutingModule } from './package-routing.module';
import { ReceivedPackageComponent } from './pages/received-package/received-package.component';
import { StarRatingModule } from '../shared/components/star-rating/star-rating.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliveredPackageComponent } from './pages/delivered-package/delivered-package.component';



@NgModule({
  declarations: [
    ReceivedPackageComponent,
    DeliveredPackageComponent,
  ],
  imports: [
    CommonModule,
    PackageRoutingModule,
    StarRatingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PackageModule { }
