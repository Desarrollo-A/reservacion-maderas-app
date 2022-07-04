import { Injectable } from '@angular/core';
import { UserSession } from "../interfaces/user-session";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private _apiToken: string = 'api-token';
  private _userSession!: UserSession;

  constructor(private http: HttpClient) {}

  get user(): UserSession {
    return { ...this._userSession };
  }

  get token(): string {
    return localStorage.getItem(this._apiToken) ?? '';
  }

  public setUser(userSession: UserSession) {
    this._userSession = userSession;
  }

  public setToken(token: string) {
    localStorage.setItem(this._apiToken, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this._apiToken);
  }

  public clearUser(): void {
    this._userSession = <UserSession>{};
  }
}
