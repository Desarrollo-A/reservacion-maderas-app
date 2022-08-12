import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './pages/car/car.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RoomComponent } from './pages/room/room.component';
import { RoomDetailComponent } from "./pages/room-detail/room-detail.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
  {path: '', redirectTo: 'sala', pathMatch: 'full'},
  {path: 'sala', component: RoomComponent, title: 'Sala de Juntas',},
  {path: 'conductor', component: DriverComponent, title: 'Conductor'},
  {path: 'auto', component: CarComponent, title: 'Automóvil'},
  {path: 'sala/:id', component: RoomDetailComponent, title: 'Solicitud detalle'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {
}
