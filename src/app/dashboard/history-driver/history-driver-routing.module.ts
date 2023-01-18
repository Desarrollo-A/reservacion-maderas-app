import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { DriverComponent } from './pages/driver/driver.component';
import { PackageComponent } from './pages/package/package.component';

const routes: Routes = [
  {path: '', redirectTo: 'paqueteria', pathMatch: 'full'},
  {path: 'paqueteria', component: PackageComponent, title: 'Paquetería'},
  {path: 'conductor', component: DriverComponent, title: 'Chofer'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryDriverRoutingModule { }
