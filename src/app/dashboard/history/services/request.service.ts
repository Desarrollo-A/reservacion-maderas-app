import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _baseUrl = 'requests';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  responseRejectRequest(id: number, statusId: number): Observable<void> {
    const url = `${this.url}/response-reject/${id}`;
    return this.http.patch<void>(url, { statusId });
  }
}
