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


@NgModule({
  declarations: [
    CalendarComponent
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
    PageLayoutModule
  ]
})
export class CalendarModule { }
