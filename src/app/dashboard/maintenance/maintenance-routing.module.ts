import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from "./pages/room/room.component";

const routes: Routes = [
  { path: 'sala', component: RoomComponent, title: 'Manto. Salas de Junta' },
  { path: '**', redirectTo: 'sala' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
