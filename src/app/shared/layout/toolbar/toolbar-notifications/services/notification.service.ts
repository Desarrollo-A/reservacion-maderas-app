import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment";
import { NotificationModel } from "../models/notification.model";
import { map, tap } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { playNotificationAudio } from "../../../../utils/utils";

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

  findById(id: number): Observable<NotificationModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<NotificationModel>(url);
  }

  findAllUnread(): void {
    const url = `${this.url}/last`;
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

  readAllNotifications(): Observable<void> {
    const url = `${this.url}/read-all`;
    return this.http.patch<void>(url, null).pipe(
      tap(() => this.readAllNotificationsLocal())
    );
  }

  answeredNotification(notificationId: number): Observable<void> {
    const url = `${this.url}/answered-notification/${notificationId}`;
    return this.http.patch<void>(url, null).pipe(
      tap(() => this.answeredNotificationLocal(notificationId))
    );
  }

  addNotification(notification: NotificationModel): void {
    let notifications = [notification].concat([... this.notifications$.value]);
    this.notifications$.next(notifications);
    playNotificationAudio();
  }

  private readNotificationLocal(id: number): void {
    let notifications = [... this.notifications$.value];
    const index = notifications.findIndex(notification => notification.id === id);
    notifications[index].isRead = true;
    this.notifications$.next(notifications);
  }

  private answeredNotificationLocal(id: number): void {
    let notifications = [... this.notifications$.value];
    const index = notifications.findIndex(notification => notification.id === id);
    notifications[index].requestNotification.actionRequestNotification.isAnswered = true;
    this.notifications$.next(notifications);
  }

  private readAllNotificationsLocal(): void {
    let notifications = [... this.notifications$.value];
    notifications.map(notification => notification.isRead = true);
    this.notifications$.next(notifications);
  }
}
