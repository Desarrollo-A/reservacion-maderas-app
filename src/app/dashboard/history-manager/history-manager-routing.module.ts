import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageListComponent } from "./pages/package-list/package-list.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageDetailComponent } from "./pages/package-detail/package-detail.component";
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";

const routes: Routes = [
  { path: '', redirectTo: 'paqueteria', pathMatch: 'full' },
  {
    path: 'paqueteria',
    component: PackageListComponent,
    title: 'Paquetería',
    data: {
      pathRoute: '/dashboard/director/solicitudes/paqueteria'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria/:id',
    component: PackageDetailComponent,
    title: 'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/director/solicitudes/paqueteria'
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
export class HistoryManagerRoutingModule { }
