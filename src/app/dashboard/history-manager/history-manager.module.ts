import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryManagerRoutingModule } from './history-manager-routing.module';
import { PackageListComponent } from './pages/package-list/package-list.component';


@NgModule({
  declarations: [
    PackageListComponent
  ],
  imports: [
    CommonModule,
    HistoryManagerRoutingModule
  ]
})
export class HistoryManagerModule { }
