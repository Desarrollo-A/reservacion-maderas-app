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

  updateSpent(id: number, data: PerDiemModel): Observable<PerDiemModel> {
    const url = `${this.url}/spent/${id}`;
    return this.http.put<PerDiemModel>(url, data);
  }

  updateBillFiles(id: number, files: File[]): Observable<void> {
    const data = new FormData();
    const url = `${this.url}/upload-bill-files/${id}`;

    data.append('_method', 'PUT');

    for (let i = 0; i < files.length; i++) {
      data.append('files[]', files[i]);
    }

    return this.http.post<void>(url, data);
  }
}
