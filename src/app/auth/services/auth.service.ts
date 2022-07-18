import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { Observable, switchMap, tap } from "rxjs";
import { UserSession } from "../../core/interfaces/user-session";
import { UserSessionService } from "../../core/services/user-session.service";
import { NavigationDropdown, NavigationLink } from "../../shared/interfaces/navigation-item.interface";
import { Menu } from "../interfaces/menu";
import { map } from "rxjs/operators";
import { NavigationService } from "../../shared/services/navigation.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl = 'auth';

  constructor(private http: HttpClient,
              private userSessionService: UserSessionService,
              private navigationService: NavigationService) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  login(data: User): Observable<void> {
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
        }),
        switchMap(() => this.getNavigationMenu()),
        map<Array<NavigationLink | NavigationDropdown>, void>(navigationItem => {
          this.navigationService.childrenItems = navigationItem;
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
        this.navigationService.clearItems();
      })
    );
  }

  getUserSession(): Observable<void> {
    const url = `${this.url}/user`;
    return this.http.get<UserSession>(url).pipe(
      tap(user => this.userSessionService.setUser(user)),
      switchMap(() => this.getNavigationMenu()),
      map<Array<NavigationLink | NavigationDropdown>, void>(navigationItem => {
        this.navigationService.childrenItems = navigationItem;
      })
    );
  }

  changePassword(data: User): Observable<void> {
     const url = `${this.url}/change-password`;
     return this.http.post<void>(url, data);
  }

  getNavigationMenu(): Observable<Array<NavigationLink | NavigationDropdown>> {
    const url = `${this.url}/navigation`;
    return this.http.get<Menu[]>(url).pipe(
      map<Menu[], Array<NavigationLink | NavigationDropdown>>(menus => {
        let navigationItems: Array<NavigationDropdown | NavigationLink> = [];

        menus.forEach(menu => {
          const haveChildren = menu.submenu.length > 0;
          let children: Array<NavigationLink> = [];
          if (haveChildren) {
            menu.submenu.forEach(({ pathRoute, label }) => {
              children.push({
                type: 'link',
                route: pathRoute,
                label
              });
            });
          }

          if (haveChildren) {
            navigationItems.push({
              type: 'dropdown',
              label: menu.label,
              icon: menu.icon,
              children
            });
          } else {
            navigationItems.push({
              type: 'link',
              route: menu.pathRoute,
              label: menu.label,
              icon: menu.icon
            });
          }
        });

        return navigationItems;
      })
    );
  }
}
