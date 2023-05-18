import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { DriverComponent } from "./pages/driver/driver.component";
import { CarComponent } from "./pages/car/car.component";
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";

const routes: Routes = [
  { path: '', redirectTo: 'sala', pathMatch: 'full' },
  {
    path: 'vehiculo',
    component: CarComponent,
    title: 'Vehículo',
    data: {
      pathRoute: '/dashboard/solicitud/vehiculo'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'conductor',
    component: DriverComponent,
    title: 'Chofer',
    data: {
      pathRoute: '/dashboard/solicitud/conductor'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'sala',
    component: RoomComponent,
    title: 'Sala de Juntas',
    data: {
      pathRoute: '/dashboard/solicitud/sala'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
