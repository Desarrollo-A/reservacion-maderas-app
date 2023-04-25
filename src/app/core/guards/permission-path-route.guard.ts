import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { NavigationService } from "../services/navigation.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionPathRouteGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasPermission(route.data['pathRoute']);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.hasPermission(route.data['pathRoute']);
  }

  hasPermission(pathRoute: string): Observable<boolean> {
    return this.navigationService.hasPermission(pathRoute).pipe(
      tap(hasPermission => {
        if (!hasPermission) {
          this.router.navigateByUrl('/dashboard');
        }
      })
    );
  }
}
