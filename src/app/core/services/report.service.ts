import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, Observable } from "rxjs";
import { PaginationResponse } from "../interfaces/pagination-response";
import { InputOutputInventoryModel } from "../models/input-output-inventory.model";
import { getPaginateParams } from "../../shared/utils/http-functions";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private _baseUrl = 'reports';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
    : Observable<PaginationResponse<InputOutputInventoryModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);
    const url = `${this.url}/input-output`;

    return this.http.get<PaginationResponse<InputOutputInventoryModel>>(url, {params}).pipe(
      map(res => {
        res.data = res.data.map(inventory => new InputOutputInventoryModel(inventory));
        return res;
      })
    );
  }
}

