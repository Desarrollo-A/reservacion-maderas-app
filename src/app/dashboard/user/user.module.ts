import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { MaterialModule } from 'src/app/material/material.module';
import { PaginatorModule } from 'src/app/shared/components/paginator/paginator.module';
import { PageLayoutModule } from 'src/app/shared/components/page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { SidenavModule } from 'src/app/shared/layout/sidenav/sidenav.module';
import { ToolbarModule } from 'src/app/shared/layout/toolbar/toolbar.module';
import { BreadcrumbsModule } from 'src/app/shared/components/breadcrumbs/breadcrumbs.module';
import { UpdateUserComponent } from './components/update-user/update-user.component';


@NgModule({
  declarations: [
    UserListComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    PaginatorModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    SidenavModule,
    ToolbarModule,
    BreadcrumbsModule
  ]
})
export class UserModule { }
