import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlPipe } from './url.pipe';


@NgModule({
  declarations: [
    UrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UrlPipe
  ]
})
export class UrlModule { }
