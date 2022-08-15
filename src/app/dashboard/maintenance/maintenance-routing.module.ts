import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './pages/car/car.component';
import { RoomComponent } from "./pages/room/room.component";

const routes: Routes = [
  { path: 'sala', component: RoomComponent, title: 'Manto. Salas de Junta' },
  { path: 'auto', component: CarComponent, title: 'Manto. Automóvil' },
  { path: '**', redirectTo: 'sala' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
 