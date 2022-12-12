import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './pages/room/room.component';
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { PackageComponent } from "./pages/package/package.component";
import { DriverComponent } from "./pages/driver/driver.component";
import { CarComponent } from "./pages/car/car.component";

const routes: Routes = [
  {path: '', redirectTo: 'sala', pathMatch: 'full'},
  {path: 'automovil', component: CarComponent, title: 'Automóvil'},
  {path: 'conductor', component: DriverComponent, title: 'Chofer'},
  {path: 'paqueteria', component: PackageComponent, title: 'Paquetería'},
  {path: 'sala', component: RoomComponent, title: 'Sala de Juntas'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
