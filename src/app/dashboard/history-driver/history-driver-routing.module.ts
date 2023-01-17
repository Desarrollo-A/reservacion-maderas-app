import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageComponent } from './pages/package/package.component';

const routes: Routes = [
  {path: '', redirectTo: 'paqueteria', pathMatch: 'full'},
  {path: 'paqueteria', component: PackageComponent, title: 'Paquetería'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryDriverRoutingModule { }
