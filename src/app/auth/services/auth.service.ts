import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { Observable, tap } from "rxjs";
import { UserSession } from "../../core/interfaces/user-session";
import { UserSessionService } from "../../core/services/user-session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl = 'auth';

  constructor(private http: HttpClient,
              private userSessionService: UserSessionService) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  login(data: User): Observable<UserSession> {
    const url = `${this.url}/login`;
    return this.http.post<UserSession>(url, data)
      .pipe(
        tap(user => {
          // Se guarda información del token en localStorage
          this.userSessionService.setToken(user.token);
          this.userSessionService.setUser(user);
          if (data.rememberMe) {
            this.userSessionService.setCredentials(data);
          } else {
            this.userSessionService.removeCredentials();
          }
          // TODO: falta poner la carga del menú
        })
      );
  }

  //Función para recuperación de contraseña
  forgotPassword(data: User): Observable<void> {
    const url = `${this.url}/restore-password`;
    return this.http.post<void>(url, data);   
  }

  logout(): Observable<void> {
    const url = `${this.url}/logout`;
    return this.http.get<void>(url)
    .pipe(
      tap( () => {
        // Se eliminan los datos de localStorage
        this.userSessionService.removeToken();
        this.userSessionService.clearUser();
      })
    );   
  }

  getUserSession(): Observable<UserSession> {
    const url = `${this.url}/user`;
    return this.http.get<UserSession>(url).pipe(
      tap(user => this.userSessionService.setUser(user))
    );
  }

  ChangePassword(data: User): Observable<void>{
     const url = `${this.url}/change-password`
     return this.http.post<void>(url, data)
  }
  

}