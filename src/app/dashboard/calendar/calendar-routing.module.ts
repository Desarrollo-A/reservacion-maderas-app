import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent} from "./pages/calendar/calendar.component";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

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
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
