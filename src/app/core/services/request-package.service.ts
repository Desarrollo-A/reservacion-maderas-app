import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthCodePackage } from 'src/app/package/interfaces/auth-code-package';
import { DeliveredPackage } from 'src/app/package/interfaces/delivered-package';

@Injectable({
  providedIn: 'root'
})
export class RequestPackageService {

  private _baseUrl = 'request-packages';
  
  constructor(private http: HttpClient) {}

  get url(): string{
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  insertRequestPackageScore(requestId: number, score: number, comment: string): Observable<void>{
    const request = {requestId, score, comment};
    const url = `${this.url}/insert-score`;
    return this.http.post<void>(url, request);
  }

  isPackageRequestCompleted(requestPackageId: number): Observable<boolean>{
    const url = `${this.url}/completed/${requestPackageId}`;
    return this.http.get<DeliveredPackage>(url)
    .pipe(
      map(res => res.deliveredPackage)
    );
  }

  isAuthCodePackage(requestAuthCodePackage: string): Observable<boolean>{
    const url = `${this.url}/auth-code/${requestAuthCodePackage}`;
    return this.http.get<AuthCodePackage>(url)
    .pipe(
      map(res=>res.authCodePackage)
    );
  }

  showCodePackage(packageId: number): Observable<{code: string}>{
    const url = `${this.url}/show/${packageId}`;
    return this.http.get<{code: string}>(url);
  }

}