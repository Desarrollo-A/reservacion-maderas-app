import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { RequestPhoneNumberModel } from "../models/request-phone-number.model";

@Injectable({
  providedIn: 'root'
})
export class RequestPhoneNumberService {
  private _baseUrl = 'request-phone-numbers';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestPhoneNumberModel): Observable<RequestPhoneNumberModel> {
    return this.http.post<RequestPhoneNumberModel>(this.url, data);
  }

  update(id: number, data: RequestPhoneNumberModel): Observable<RequestPhoneNumberModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<RequestPhoneNumberModel>(url, data);
  }

  delete(id: number): Observable<void> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url);
  }
}
