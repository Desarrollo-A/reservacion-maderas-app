import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCodePackageGuard } from './guards/auth-code-package.guard';
import { ValidRequestPackageGuard } from './guards/valid-request-package.guard';
import { PageNotFoundComponent } from '../shared/components/page-not-found/page-not-found.component';
import { DeliveredPackageComponent } from './pages/delivered-package/delivered-package.component';
import { ReceivedPackageComponent } from './pages/received-package/received-package.component';

const routes: Routes = [
  {
    path: 'calificacion',
    component: DeliveredPackageComponent,
    title: 'Calificacion de paqueteria'
  },
  {
    path: ':id',
    component: ReceivedPackageComponent, 
    canActivate:[AuthCodePackageGuard, ValidRequestPackageGuard],
    title: 'Estatus del paquete'
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

export class PackageRoutingModule { }
