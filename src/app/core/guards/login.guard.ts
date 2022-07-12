import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { UserSessionService } from "../services/user-session.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {
  constructor(private userSessionService: UserSessionService,
              private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.userSessionService.token;
    if (token.length > 0) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }

    return true;
  }

}
