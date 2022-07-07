import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarComponent } from './pages/car/car.component';
import { DriverComponent } from './pages/driver/driver.component';
import { RoomComponent } from './pages/room/room.component';

const routes: Routes = [
  {path: 'sala', component: RoomComponent, title: 'Sala de Juntas' },
  {path: 'conductor', component: DriverComponent, title: 'Conductor' },
  {path: 'auto', component: CarComponent, title: 'Automóvil' },
  {path: '**', redirectTo:'sala'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
