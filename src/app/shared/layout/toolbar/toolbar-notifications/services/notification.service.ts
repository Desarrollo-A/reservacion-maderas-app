import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";
import { NotificationModel } from "../models/notification.model";
import { map, tap } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";

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

  readNotification(id: number): Observable<void> {
    const url = `${this.url}/read/${id}`;
    return this.http.patch<void>(url, null).pipe(
      tap(() => this.readNotificationLocal(id))
    );
  }

  private readNotificationLocal(id: number): void {
    let notifications = [... this.notifications$.value];
    const index = notifications.findIndex(notification => notification.id === id);
    notifications[index].isRead = true;
    this.notifications$.next(notifications);
  }
}
