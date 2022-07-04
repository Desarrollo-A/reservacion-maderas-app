import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { SidenavItemModule } from './sidenav-item/sidenav-item.module';
import { ScrollbarModule } from '../../components/scrollbar/scrollbar.module';
import { UserMenuModule } from '../../components/user-menu/user-menu.module';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';
import { MaterialModule } from "../../../material/material.module";


@NgModule({
  declarations: [SidenavComponent],
  imports: [
    CommonModule,
    SidenavItemModule,
    ScrollbarModule,
    MaterialModule,
    UserMenuModule,

    SearchModalComponent
  ],
  exports: [SidenavComponent]
})
export class SidenavModule {
}
