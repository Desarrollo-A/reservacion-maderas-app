import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView } from "angular-calendar";
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from "rxjs";
import { CalendarService } from "../../../../core/services/calendar.service";
import { MatDialog } from "@angular/material/dialog";
import { RequestService } from "../../../../core/services/request.service";
import { RequestModel } from "../../../../core/models/request.model";
import { CalendarDetailComponent } from "../../components/calendar-detail/calendar-detail.component";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true })
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent<RequestModel>[] = [];
  activeDayIsOpen = false;

  constructor(private calendarService: CalendarService,
              private dialog: MatDialog,
              private requestService: RequestService) {}

  ngOnInit(): void {
    this.calendarService.findAll().subscribe(events => this.events = events);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0);
      this.viewDate = date;
    }
  }

  handleEvent(event: CalendarEvent<RequestModel>): void {
    this.requestService.findById(event.meta.id).subscribe(request => {
      this.dialog.open(CalendarDetailComponent, {
        data: request,
        autoFocus: false,
        width: '400px'
      });
    });
  }
}
