import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageListComponent } from "./pages/package-list/package-list.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: '', redirectTo: 'paqueteria', pathMatch: 'full' },
  { path: 'paqueteria', component: PackageListComponent, title: 'Paquetería' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryManagerRoutingModule { }
