import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, Observable } from "rxjs";
import { PaginationResponse } from "../interfaces/pagination-response";
import { InputOutputInventoryModel } from "../models/input-output-inventory.model";
import {
  acceptApplicationExcelHeader,
  acceptApplicationPdfHeader,
  getFiltersQueryParams,
  getPaginateParams
} from "../../shared/utils/http-functions";
import { Filters } from "../interfaces/filters";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private _baseUrl = 'reports';
  // private _baseUrlLocalhost = 'http://localhost/recepcioncm-api/public/api/v1/reports/';

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

  reportInputOutputInventoryPdf(filters: Filters): Observable<Blob> {
    const params = getFiltersQueryParams(filters);
    const headers = acceptApplicationPdfHeader();
    // const url = `${this._baseUrlLocalhost}input-output/pdf`;
    const url = `${this.url}input-output/pdf`;
    return this.generateReportPdf(params, headers, url);
  }

  reportInputOutputInventoryExcel(filters: Filters): Observable<Blob> {
    const params = getFiltersQueryParams(filters);
    const headers = acceptApplicationExcelHeader();
    // const url = `${this._baseUrlLocalhost}input-output/excel`;
    const url = `${this.url}input-output/excel`;
    return this.generateReportExcel(params, headers, url);
  }

  private generateReportPdf(params: HttpParams, headers: HttpHeaders, url: string): Observable<Blob> {
    return this.http.get(url, {params, headers, responseType: 'blob'});
  }

  private generateReportExcel(params: HttpParams, headers: HttpHeaders, url: string): Observable<Blob> {
    return this.http.get(url, {params, headers, responseType: 'blob'});
  }
}

