import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { DriverComponent } from './pages/driver/driver.component';
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';
import { PackageComponent } from './pages/package/package.component';
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";

const routes: Routes = [
  {path:  '', redirectTo: 'paqueteria', pathMatch: 'full'},
  {
    path: 'paqueteria',
    component: PackageComponent,
    title:  'Paquetería',
    data: {
      pathRoute: '/dashboard/solicitudes-asignadas/paqueteria'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria/:id',
    component: PackageDetailComponent,
    title:  'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/solicitudes-asignadas/paqueteria'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'conductor',
    component: DriverComponent,
    title:  'Chofer',
    data: {
      pathRoute: '/dashboard/solicitudes-asignadas/conductor'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'conductor/:id',
    component: DriverDetailComponent,
    title:  'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/solicitudes-asignadas/conductor'
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
export class HistoryDriverRoutingModule { }
