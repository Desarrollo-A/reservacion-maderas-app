import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { PaginationResponse } from "../../../core/interfaces/pagination-response";
import { InventoryModel } from "../models/inventory.model";
import { getPaginateParams } from "../../../shared/utils/http-functions";
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

  findById(id: number): Observable<InventoryModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<InventoryModel>(url);
  }
}
