import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Menu } from "../interfaces/menu";
import { environment } from "../../../environments/environment";
import { SyncNavigation } from "../../dashboard/user/interfaces/sync-navigation";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _baseUrl = 'navigation';

  constructor(
    private http: HttpClient
  ) { }

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  getNavigationByUserId(userId: number): Observable<Menu[]> {
    const url = `${this.url}/by-user/${userId}`;
    return this.http.get<Menu[]>(url);
  }

  syncNavigation(userId: number, data: SyncNavigation): Observable<void> {
    const url = `${this.url}/permission/${userId}`;
    return this.http.put<void>(url, data);
  }

  hasPermission(pathRoute: string): Observable<boolean> {
    const url = `${this.url}/has-permission`;
    const params = new HttpParams()
      .append('pathRoute', pathRoute);

    return this.http.get<{hasPermission: boolean}>(url, { params }).pipe(
      map(data => data.hasPermission)
    );
  }
}
