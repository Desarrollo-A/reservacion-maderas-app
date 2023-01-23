import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { DriverDetailComponent } from './pages/driver-detail/driver-detail.component';
import { DriverComponent } from './pages/driver/driver.component';
import { PackageDetailComponent } from './pages/package-detail/package-detail.component';
import { PackageComponent } from './pages/package/package.component';

const routes: Routes = [
  {path:  '', redirectTo: 'paqueteria', pathMatch: 'full'},
  {path:  'paqueteria',     component: PackageComponent,        title:  'Paquetería'},
  {path:  'paqueteria/:id', component: PackageDetailComponent,  title:  'Solicitud detalle'},
  {path:  'conductor',      component: DriverComponent,         title:  'Chofer'},
  {path:  'conductor/:id',  component: DriverDetailComponent,   title:  'Solicitud detalle'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryDriverRoutingModule { }
