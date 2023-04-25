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
      pathRoute: '/dashboard/historial/vehiculo'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'conductor',
    component: DriverComponent,
    title: 'Chofer',
    data: {
      pathRoute: '/dashboard/historial/conductor'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'sala',
    component: RoomComponent,
    title: 'Sala de Juntas',
    data: {
      pathRoute: '/dashboard/historial/sala'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria',
    component: PackageComponent,
    title: 'Paquetería',
    data: {
      pathRoute: '/dashboard/historial/paqueteria'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'vehiculo/:id',
    component: CarDetailComponent,
    title: 'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/historial/vehiculo'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'conductor/:id',
    component: DriverDetailComponent,
    title: 'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/historial/conductor'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'sala/:id',
    component: RoomDetailComponent,
    title: 'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/historial/sala'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria/:id',
    component: PackageDetailComponent,
    title: 'Solicitud detalle',
    data: {
      pathRoute: '/dashboard/historial/paqueteria'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {
}
