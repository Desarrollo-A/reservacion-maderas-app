import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputOutputInventoryComponent} from "./pages/input-output-inventory/input-output-inventory.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageComponent } from './pages/package/package.component';
import { PermissionRoleGuard } from "../../core/guards/permission-role.guard";
import { NameRole } from "../../core/enums/name-role";
import { PermissionPathRouteGuard } from "../../core/guards/permission-path-route.guard";

const routes: Routes = [
  {
    path: 'entrada-salida',
    component: InputOutputInventoryComponent,
    title: 'Inventario',
    data: {
      roles: [NameRole.RECEPCIONIST],
      pathRoute: '/dashboard/reporte/entrada-salida'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  {
    path: 'paqueteria',
    component: PackageComponent,
    title: 'Paquetería',
    data: {
      roles: [NameRole.DRIVER],
      pathRoute: '/dashboard/reporte/paqueteria'
    },
    canActivate: [ PermissionRoleGuard, PermissionPathRouteGuard ],
    canLoad: [ PermissionRoleGuard, PermissionPathRouteGuard ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
