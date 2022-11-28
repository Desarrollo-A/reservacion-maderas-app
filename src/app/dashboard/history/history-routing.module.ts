import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { RoomDetailComponent } from "./pages/room-detail/room-detail.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageComponent } from "./pages/package/package.component";
import { PackageDetailComponent } from "./pages/package-detail/package-detail.component";

const routes: Routes = [
  {path: '', redirectTo: 'sala', pathMatch: 'full'},
  {path: 'sala', component: RoomComponent, title: 'Sala de Juntas',},
  {path: 'paqueteria', component: PackageComponent, title: 'Paquetería'},
  {path: 'sala/:id', component: RoomDetailComponent, title: 'Solicitud detalle'},
  {path: 'paqueteria/:id', component: PackageDetailComponent, title: 'Solicitud detalle'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {
}
