import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { MaterialModule } from "../../material/material.module";
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { ScrollbarModule } from "../../shared/components/scrollbar/scrollbar.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PageLayoutModule } from "../../shared/components/page-layout/page-layout.module";
import { PageNotFoundModule } from "../../shared/components/page-not-found/page-not-found.module";
import { CalendarDetailComponent } from './components/calendar-detail/calendar-detail.component';


@NgModule({
  declarations: [
    CalendarComponent,
    CalendarDetailComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MaterialModule,
    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ScrollbarModule,
    ReactiveFormsModule,
    PageLayoutModule,
    PageNotFoundModule
  ]
})
export class CalendarModule { }
