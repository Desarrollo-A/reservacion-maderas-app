import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { PaginationResponse } from "../interfaces/pagination-response";
import { InventoryModel } from "../models/inventory.model";
import { getPaginateParams } from "../../shared/utils/http-functions";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private _baseUrl = 'inventories';

  constructor(private http: HttpClient) {
  }

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<InventoryModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<InventoryModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(inventory => new InventoryModel(inventory));
          return res;
        })
      );
  }

  findAllSnacks(): Observable<InventoryModel[]> {
    const url = `${this.url}/coffee`;
    return this.http.get<InventoryModel[]>(url);
  }

  findById(id: number): Observable<InventoryModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<InventoryModel>(url);
  }

  updateStock(id: number, stock: number, cost: number): Observable<void> {
    const url = `${this.url}/stock/${id}`;
    return this.http.patch<void>(url, { stock, cost });
  }

  updateImage(id: number, image: File): Observable<void> {
    const data = new FormData();
    data.append('image', image);
    data.append('_method', 'PUT');

    const url = `${this.url}/image/${id}`;
    return this.http.post<void>(url, data);
  }

  store(inventory: InventoryModel): Observable<InventoryModel> {
    return this.http.post<InventoryModel>(this.url, inventory);
  }

  update(id: number, inventory: InventoryModel): Observable<InventoryModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<InventoryModel>(url, inventory);
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        map(() => true)
      );
  }

  deleteImage(id: number): Observable<void> {
    const url = `${this.url}/image/${id}`;
    return this.http.delete<void>(url);
  }
}
