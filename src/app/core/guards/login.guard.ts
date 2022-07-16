import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSessionService } from "../services/user-session.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild,CanActivate,CanLoad {
  constructor(private userSessionService: UserSessionService,
              private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.hasToken();
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.hasToken();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  return this.hasToken();
  }

  private hasToken(): boolean {
    const token = this.userSessionService.token;
    if (token.length > 0) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }

    return true;
  }

}
