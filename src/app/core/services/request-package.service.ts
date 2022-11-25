import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { PackageModel } from "../models/package.model";
import { RequestModel } from "../models/request.model";
import { PaginationResponse } from "../interfaces/pagination-response";
import { getPaginateParams } from "../../shared/utils/http-functions";
import { map } from "rxjs/operators";
import { RequestPackageViewModel } from "../models/request-package-view.model";

@Injectable({
  providedIn: 'root'
})
export class RequestPackageService {
  private _baseUrl = 'request-packages';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestModel): Observable<PackageModel> {
    return this.http.post<PackageModel>(this.url, data);
  }

  uploadFile(id: number, file: File): Observable<void> {
    const data = new FormData();
    data.append('file', file);
    data.append('_method', 'PUT');

    const url = `${this.url}/upload-file/${id}`;
    return this.http.post<void>(url, data);
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
    : Observable<PaginationResponse<RequestPackageViewModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<RequestPackageViewModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(requestPackage => new RequestPackageViewModel(requestPackage));
          return res;
        })
      );
  }
}
