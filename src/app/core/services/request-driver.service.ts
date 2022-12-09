import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { RequestModel } from "../models/request.model";
import { Observable } from "rxjs";
import { RequestDriverModel } from "../models/request-driver.model";

@Injectable({
  providedIn: 'root'
})
export class RequestDriverService {
  private _baseUrl = 'request-drivers';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestModel): Observable<RequestDriverModel> {
    return this.http.post<RequestDriverModel>(this.url, data);
  }

  uploadFile(id: number, file: File): Observable<void> {
    const data = new FormData();
    data.append('file', file);
    data.append('_method', 'PUT');

    const url = `${this.url}/upload-file/${id}`;
    return this.http.post<void>(url, data);
  }
}
