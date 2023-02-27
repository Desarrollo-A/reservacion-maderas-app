import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputOutputInventoryComponent} from "./pages/input-output-inventory/input-output-inventory.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageComponent } from './pages/package/package.component';
import { PermissionGuard } from "../../core/guards/permission.guard";
import { NameRole } from "../../core/enums/name-role";

const routes: Routes = [
  {
    path: 'entrada-salida',
    component: InputOutputInventoryComponent,
    title: 'Inventario',
    data: { roles: [NameRole.RECEPCIONIST] },
    canActivate: [ PermissionGuard ],
    canLoad: [ PermissionGuard ]
  },
  {
    path: 'paqueteria',
    component: PackageComponent,
    title: 'Paquetería',
    data: { roles: [NameRole.DRIVER] },
    canActivate: [ PermissionGuard ],
    canLoad: [ PermissionGuard ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
