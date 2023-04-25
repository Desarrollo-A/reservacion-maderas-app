import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { UserPermissionComponent } from "./pages/user-permission/user-permission.component";
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";

const routes: Routes = [
  { path: '', redirectTo: 'listado', pathMatch: 'full' },
  {
    path: 'listado',
    component: UserListComponent,
    title: 'Listado de usuarios',
    data: {
      pathRoute: '/dashboard/usuarios/listado'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'permisos',
    component: UserPermissionComponent,
    title: 'Permisos',
    data: {
      pathRoute: '/dashboard/usuarios/permisos'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
