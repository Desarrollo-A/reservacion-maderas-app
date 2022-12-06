import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { RequestPackageService } from '../../core/services/request-package.service';
import { map, Observable } from "rxjs";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthCodePackageGuard implements CanActivate {

  constructor(private router: Router,
              private requestPackageService: RequestPackageService,
              private toastrService: ToastrService){}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.requestPackageService.isAuthCodePackage(route.queryParams?.code ?? 'X')
    .pipe(
      map( data =>{
        if(!data){
          this.router.navigateByUrl('/404');
          this.toastrService.warning('Código inválido', 'Advertencia');
        }
        return data;
      })
    );
  }
  
}

