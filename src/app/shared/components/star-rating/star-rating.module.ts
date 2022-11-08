import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating.component';
import { StarComponent } from './components/star/star.component';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [
    StarRatingComponent,
    StarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    StarRatingComponent
  ]
})
export class StarRatingModule { }
