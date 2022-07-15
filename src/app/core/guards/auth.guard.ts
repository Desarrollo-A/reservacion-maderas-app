import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserSessionService } from '../services/user-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private userSessionService:UserSessionService,
              private authService:AuthService,
              private router:Router ){}

  
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
      catchError(() => of(false)),
      tap(isAuthenticated => {
        if(!isAuthenticated){
          this.userSessionService.removeToken();
          this.userSessionService.clearUser();
          this.router.navigateByUrl('/auth/acceso');
        }
      })
    )
  }     
}
