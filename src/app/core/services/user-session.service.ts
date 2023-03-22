import { Injectable } from '@angular/core';
import { UserSession } from "../interfaces/user-session";
import { User } from "../interfaces/user";
import { NameRole } from "../enums/name-role";

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private _apiToken = 'api-token';
  private _credentials = 'credentials';
  private _userSession!: UserSession;

  constructor() {}

  get credentials(): User {
    return JSON.parse(localStorage.getItem(this._credentials));
  }

  get user(): UserSession {
    return { ...this._userSession };
  }

  get userFirstLastName(): string {
    const full = this.user.fullName?.split(" ") ?? '';
    return (full === '') ? '' : full[0]+' '+full[1];
  }

  get token(): string {
    return localStorage.getItem(this._apiToken) ?? '';
  }

  get isApplicant(): boolean {
    return this.user?.role?.name === NameRole.APPLICANT;
  }

  get isRecepcionist(): boolean {
    return this.user?.role?.name === NameRole.RECEPCIONIST;
  }

  get isAdmin(): boolean {
    return this.user?.role?.name === NameRole.ADMIN;
  }

  get isDriver(): boolean {
    return this.user?.role?.name === NameRole.DRIVER;
  }

  get isDepartmentManager(): boolean {
    return this.user?.role?.name === NameRole.DEPARTMENT_MANAGER;
  }

  setUser(userSession: UserSession): void {
    this._userSession = userSession;
  }

  setToken(token: string): void {
    localStorage.setItem(this._apiToken, token);
  }

  setCredentials(user: User): void {
    localStorage.setItem(this._credentials, JSON.stringify(user));
  }

  removeCredentials(): void {
    localStorage.removeItem(this._credentials);
  }

  removeToken(): void {
    localStorage.removeItem(this._apiToken);
  }

  clearUser(): void {
    this._userSession = <UserSession>{};
  }
}
