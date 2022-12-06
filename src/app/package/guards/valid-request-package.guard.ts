import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { RequestPackageService } from '../../core/services/request-package.service';
import { map, Observable, throwError, catchError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ValidRequestPackageGuard implements CanActivate {

  constructor(private router: Router,
              private requestPackageService: RequestPackageService){
    
  }
  
  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean>{
    const requestPackageId = route.params.id;
    return this.requestPackageService.isPackageRequestCompleted(requestPackageId)
      .pipe(
        map(dataDeliveredPackage => {
          if(!dataDeliveredPackage){
            this.router.navigateByUrl('/paqueteria/calificacion');
          }
          return dataDeliveredPackage;
        }), 
        catchError((error) => {
          if (error.code === 404) {
            this.router.navigateByUrl('/404');
          }
          return throwError(() => error);
        })
      );
  }
}