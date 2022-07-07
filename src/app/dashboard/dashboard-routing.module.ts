import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'solicitud',//para URL
        loadChildren: () => import('./request/request.module').then(m => m.RequestModule)
      },
      {
        path: 'calendar',//para URL
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
      },
      {
        path: 'inventory',//para URL
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule)
      },
      {
        path: 'report',//para URL
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
      },
      {
        path: 'history',//para URL
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
