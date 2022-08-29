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
import { UserSessionService } from "../services/user-session.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate, CanLoad {
  constructor(private router: Router,
              private userSessionService: UserSessionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data['roles'] as string[];
    const authorize = this.isAuthorize(roles);
    if (!authorize) {
      this.router.navigateByUrl('/dashboard');
    }
    return true;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const roles = route.data['roles'] as string[];
    const authorize = this.isAuthorize(roles);
    if (!authorize) {
      this.router.navigateByUrl('/dashboard');
    }
    return true;
  }

  private isAuthorize(roles: string[]): boolean {
    if (this.userSessionService.user.role) {
      const authorize = roles.find(rol => rol === this.userSessionService.user?.role?.name);
      return authorize !== undefined;
    }

    return true;
  }
}
