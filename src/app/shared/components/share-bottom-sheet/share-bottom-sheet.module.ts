import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareBottomSheetComponent } from './share-bottom-sheet.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [ShareBottomSheetComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    MatBottomSheetModule
  ]
})
export class ShareBottomSheetModule {
}
