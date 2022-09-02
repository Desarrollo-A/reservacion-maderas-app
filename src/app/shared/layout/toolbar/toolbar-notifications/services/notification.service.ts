import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";
import { NotificationModel } from "../models/notification.model";
import { map } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _baseUrl = 'notifications';

  public notifications$: BehaviorSubject<NotificationModel[]> = new BehaviorSubject<NotificationModel[]>([]);

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllUnread(): void {
    const url = `${this.url}/unread`;
    this.http.get<NotificationModel[]>(url)
      .pipe(
        map(notifications => notifications.map(notification => new NotificationModel(notification)))
      ).subscribe(notifications => this.notifications$.next(notifications));
  }
}
