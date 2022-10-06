import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { CalendarEvent } from "angular-calendar";
import { CalendarModel } from "../models/calendar-model";
import { map } from "rxjs/operators";
import { RequestModel } from "../../request/models/request.model";
import { EventColor } from "calendar-utils";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _baseUrl = 'calendar';
  private color: EventColor = {
    primary: '#B6A269',
    secondary: '#18385F'
  };

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAll(): Observable<CalendarEvent<RequestModel>[]> {
    return this.http.get<CalendarModel[]>(this.url).pipe(
      map(dataCalendar => {
        let data: CalendarEvent<RequestModel>[] = [];
        dataCalendar.forEach(calendar => {
          const event: CalendarEvent = {
            id: calendar.request.id,
            start: new Date(calendar.request.startDate),
            end: new Date(calendar.request.endDate),
            title: calendar.title,
            color: this.color,
            meta: calendar.request
          };
          data.push(event);
        });

        return data;
      })
    );
  }
}
