import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './pages/car/car.component';
import { RoomComponent } from "./pages/room/room.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { DriverComponent } from './pages/driver/driver.component';

const routes: Routes = [
  { path: '', redirectTo: 'sala', pathMatch: 'full' },
  { path: 'sala', component: RoomComponent, title: 'Manto. Salas de Junta' },
  { path: 'auto', component: CarComponent, title: 'Manto. Automóvil' },
  { path: 'conductor', component: DriverComponent, title:'Manto. Chofer'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
 