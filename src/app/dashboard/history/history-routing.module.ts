import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { RoomDetailComponent } from "./pages/room-detail/room-detail.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageComponent } from "./pages/package/package.component";
import { PackageDetailComponent } from "./pages/package-detail/package-detail.component";
import { DriverComponent } from "./pages/driver/driver.component";
import { DriverDetailComponent } from "./pages/driver-detail/driver-detail.component";
import { CarComponent } from './pages/car/car-component';
import { CarDetailComponent } from "./pages/car-detail/car-detail.component";
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";
import { PermissionRoleGuard } from "../../core/guards/permission-role.guard";
import { NameRole } from "../../core/enums/name-role";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sala',
    pathMatch: 'full'
  },
  {
    path: 'vehiculo',
    component: CarComponent,
    title: 'Vehículo',
    data: {
      roles: [NameRole.RECEPCIONIST, NameRole.APPLICANT],
      pathRoute: '/dashboard/historial/vehiculo'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'conductor',
    component: DriverComponent,
    title: 'Chofer',
    data: {
      roles: [NameRole.RECEPCIONIST, NameRole.APPLICANT],
      pathRoute: '/dashboard/historial/conductor'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'sala',
    component: RoomComponent,
    title: 'Sala de Juntas',
    data: {
      roles: [NameRole.RECEPCIONIST, NameRole.APPLICANT],
      pathRoute: '/dashboard/historial/sala'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria',
    component: PackageComponent,
    title: 'Paquetería',
    data: {
      roles: [NameRole.RECEPCIONIST],
      pathRoute: '/dashboard/historial/paqueteria'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'vehiculo/:id',
    component: CarDetailComponent,
    title: 'Solicitud detalle',
    data: {
      roles: [NameRole.RECEPCIONIST, NameRole.APPLICANT],
      pathRoute: '/dashboard/historial/vehiculo'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'conductor/:id',
    component: DriverDetailComponent,
    title: 'Solicitud detalle',
    data: {
      roles: [NameRole.RECEPCIONIST, NameRole.APPLICANT],
      pathRoute: '/dashboard/historial/conductor'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'sala/:id',
    component: RoomDetailComponent,
    title: 'Solicitud detalle',
    data: {
      roles: [NameRole.RECEPCIONIST, NameRole.APPLICANT],
      pathRoute: '/dashboard/historial/sala'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria/:id',
    component: PackageDetailComponent,
    title: 'Solicitud detalle',
    data: {
      roles: [NameRole.RECEPCIONIST],
      pathRoute: '/dashboard/historial/paqueteria'
    },
    canActivate: [PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {
}
