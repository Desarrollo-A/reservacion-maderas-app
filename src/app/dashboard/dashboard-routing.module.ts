import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { PermissionGuard } from "../core/guards/permission.guard";
import { NameRole } from "../core/enums/name-role";

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'solicitud',//para URL
        loadChildren: () => import('./request/request.module').then(m => m.RequestModule),
        data: { roles: [ NameRole.APPLICANT ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'calendario',//para URL
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
        data: {
          toolbarShadowEnabled: true,
          roles: [ NameRole.APPLICANT, NameRole.RECEPCIONIST ]
        },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'inventario',//para URL
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
        data: { roles: [ NameRole.RECEPCIONIST ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'reporte',//para URL
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        data: { roles: [ NameRole.RECEPCIONIST, NameRole.DRIVER ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'historial',//para URL
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
        data: { roles: [ NameRole.APPLICANT ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'solicitudes',//para URL
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
        data: { roles: [ NameRole.RECEPCIONIST ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'mantenimiento',
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule),
        data: { roles: [ NameRole.RECEPCIONIST ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        data: { roles: [ NameRole.ADMIN ] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path:'solicitudes-asignadas',
        loadChildren: () => import('./history-driver/history-driver.module').then(m => m.HistoryDriverModule),
        data: {roles: [NameRole.DRIVER]},
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'oficinas',
        loadChildren: () => import('./office/office.module').then(m => m.OfficeModule),
        data: { roles: [NameRole.ADMIN] },
        canActivate: [ PermissionGuard ],
        canLoad: [ PermissionGuard ]
      },
      {
        path: 'director',
        children: [
          {
            path: 'solicitudes',
            loadChildren: () => import('./history-manager/history-manager.module').then(m => m.HistoryManagerModule),
            data: { roles: [NameRole.DEPARTMENT_MANAGER] },
            canActivate: [ PermissionGuard ],
            canLoad: [ PermissionGuard ]
          }
        ]
      },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
