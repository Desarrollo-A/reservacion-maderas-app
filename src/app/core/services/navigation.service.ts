import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Menu } from "../interfaces/menu";
import { environment } from "../../../environments/environment";

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
}
