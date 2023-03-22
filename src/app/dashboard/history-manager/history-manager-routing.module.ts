import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageListComponent } from "./pages/package-list/package-list.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageDetailComponent } from "./pages/package-detail/package-detail.component";

const routes: Routes = [
  { path: '', redirectTo: 'paqueteria', pathMatch: 'full' },
  { path: 'paqueteria', component: PackageListComponent, title: 'Paquetería' },
  { path: 'paqueteria/:id', component: PackageDetailComponent, title: 'Solicitud detalle' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryManagerRoutingModule { }
