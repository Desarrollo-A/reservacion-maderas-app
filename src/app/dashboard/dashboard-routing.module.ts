import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";

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
        loadChildren: () => import('./request/request.module').then(m => m.RequestModule)
      },
      {
        path: 'calendario',//para URL
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
      },
      {
        path: 'inventario',//para URL
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)
      },
      {
        path: 'reporte',//para URL
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
      },
      {
        path: 'historial',//para URL
        loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
