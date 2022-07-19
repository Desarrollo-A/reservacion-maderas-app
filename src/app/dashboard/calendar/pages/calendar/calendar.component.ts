import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from "angular-calendar";
import { addDays, addHours, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from "rxjs";

const colors: any = {
  blue: {
    primary: '#5c77ff',
    secondary: '#FFFFFF'
  },
  yellow: {
    primary: '#ffc107',
    secondary: '#FDF1BA'
  },
  red: {
    primary: '#f44336',
    secondary: '#FFFFFF'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent {
  @ViewChild('modalContent', { static: true })
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'Sala de Junta Administrativa',
      color: colors.primary,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    },
    {
      start: startOfDay(new Date()),
      title: 'Automóvil Volkswagen Vento',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: startOfDay(new Date()),
      end: addHours(startOfDay(new Date()), 1),
      title: 'Automóvil Volkswagen Vento',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'Sala de Junta, Ejecutiva',
      color: colors.primary,
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'Evento cancelado',
      color: colors.red,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }
  ];
  activeDayIsOpen = true;

  constructor() {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0);
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {}
}
