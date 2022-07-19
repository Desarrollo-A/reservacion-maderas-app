import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent} from "./pages/calendar/calendar.component";

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    title: 'Calendario',
    data: {
      toolbarShadowEnabled: true,
      scrollDisabled: true
    }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
