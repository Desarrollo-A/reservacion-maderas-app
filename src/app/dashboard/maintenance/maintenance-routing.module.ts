import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './pages/car/car.component';
import { RoomComponent } from "./pages/room/room.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { DriverComponent } from './pages/driver/driver.component';
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";

const routes: Routes = [
  { path: '', redirectTo: 'sala', pathMatch: 'full' },
  {
    path: 'sala',
    component: RoomComponent,
    title: 'Manto. Salas de Junta',
    data: {
      pathRoute: '/dashboard/mantenimiento/sala'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'vehiculo',
    component: CarComponent,
    title: 'Manto. Vehículo',
    data: {
      pathRoute: '/dashboard/mantenimiento/vehiculo'
    },
    canActivate: [ PermissionPathRouteGuard ],
    canLoad: [ PermissionPathRouteGuard ]
  },
  {
    path: 'conductor',
    component: DriverComponent,
    title:'Manto. Chofer',
    data: {
      pathRoute: '/dashboard/mantenimiento/conductor'
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
export class MaintenanceRoutingModule { }
