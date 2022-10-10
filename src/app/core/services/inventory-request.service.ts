import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { InventoryRequestModel } from "../models/inventory-request.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InventoryRequestService {
  private _baseUrl = 'inventory-request';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: InventoryRequestModel): Observable<InventoryRequestModel> {
    return this.http.post<InventoryRequestModel>(this.url, data);
  }

  update(data: InventoryRequestModel): Observable<void> {
    const url = `${this.url}/${data.requestId}/${data.inventoryId}`;
    return this.http.put<void>(url, data);
  }

  delete(data: InventoryRequestModel): Observable<void> {
    const url = `${this.url}/${data.requestId}/${data.inventoryId}`;
    return this.http.delete<void>(url);
  }
}
