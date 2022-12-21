import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { RequestModel } from "../models/request.model";
import { RequestCarModel } from "../models/request-car.model";
import { RequestCarViewModel } from '../models/request-car-view.model';
import { PaginationResponse } from '../interfaces/pagination-response';
import { getPaginateParams } from 'src/app/shared/utils/http-functions';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RequestCarService {
  private _baseUrl = 'request-cars';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestModel): Observable<RequestCarModel> {
    return this.http.post<RequestCarModel>(this.url, data);
  }

  uploadFile(id: number, file: File): Observable<void> {
    const data = new FormData();
    data.append('file', file);
    data.append('_method', 'PUT');

    const url = `${this.url}/upload-file/${id}`;
    return this.http.post<void>(url, data);
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
    : Observable<PaginationResponse<RequestCarViewModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);
    return this.http.get<PaginationResponse<RequestCarViewModel>>(this.url, {params})
      .pipe(
        map( res => {
          res.data = res.data.map(requestCar => new RequestCarViewModel(requestCar));
          return res;
        })
      );
  }

  deleteRequestCar(requestId: number): Observable<boolean>{
    const url = `${this.url}/${requestId}`;
    return this.http.delete<boolean>(url).pipe(
      map(() => true)
    );
  }

  findByRequestId(requestId: number): Observable<RequestCarModel> {
    const url = `${this.url}/${requestId}`;
    return this.http.get<RequestCarModel>(url).pipe(
      map(res => new RequestCarModel(res))
    );
  }
}
