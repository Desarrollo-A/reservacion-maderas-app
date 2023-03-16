import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { PerDiemModel } from "../models/per-diem.model";

@Injectable({
  providedIn: 'root'
})
export class PerDiemService {
  private _baseUrl = 'per-diems';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: PerDiemModel): Observable<PerDiemModel> {
    return this.http.post<PerDiemModel>(this.url, data);
  }

  updateSpent(requestId: number, data: PerDiemModel): Observable<PerDiemModel> {
    const url = `${this.url}/spent/${requestId}`;
    return this.http.put<PerDiemModel>(url, data);
  }

  updateImage(requestId: number, bill: File): Observable<void> {
    const data = new FormData();
    data.append('bill', bill);
    data.append('_method', 'PUT');

    const url = `${this.url}/upload-bill/${requestId}`;
    return this.http.post<void>(url, data);
  }
}
