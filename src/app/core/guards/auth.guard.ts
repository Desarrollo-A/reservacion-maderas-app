import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserSessionService } from '../services/user-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private userSessionService:UserSessionService,
              private authService:AuthService){}

  canActivateChild( childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isAuthenticated();
  }

  private isAuthenticated(): Observable<boolean>{
    if(this.userSessionService.user.id){
      return of(true);
    }

    return this.authService.getUserSession()
    .pipe(
      map(() => true),
      catchError(() => of(false))
    )
  }
}
