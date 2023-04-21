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
import { UserPermissionComponent } from './pages/user-permission/user-permission.component';
import { AssignPermisionComponent } from './components/assign-permision/assign-permision.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    UserListComponent,
    UpdateUserComponent,
    UserPermissionComponent,
    AssignPermisionComponent
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
    BreadcrumbsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class UserModule { }
