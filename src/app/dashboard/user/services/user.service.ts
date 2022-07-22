import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { UserModel } from "../models/user.model";
import { Observable } from "rxjs";
import { UserSession } from "../../../core/interfaces/user-session";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _baseUrl = 'users';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: UserModel): Observable<UserSession> {
    return this.http.post<UserSession>(this.url, data);
  }
}
