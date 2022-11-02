import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { RequestEmailModel } from "../models/request-email.model";

@Injectable({
  providedIn: 'root'
})
export class RequestEmailService {
  private _baseUrl = 'request-emails';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestEmailModel): Observable<RequestEmailModel> {
    return this.http.post<RequestEmailModel>(this.url, data);
  }

  update(id: number, data: RequestEmailModel): Observable<RequestEmailModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<RequestEmailModel>(url, data);
  }

  delete(id: number): Observable<void> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url);
  }
}
