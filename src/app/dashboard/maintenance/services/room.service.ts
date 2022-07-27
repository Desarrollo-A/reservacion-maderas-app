import { Injectable } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PaginationResponse } from "../../../core/interfaces/pagination-response";
import { RoomModel } from "../model/room-model";
import { getPaginateParams } from "../../../shared/utils/http-functions";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private _baseUrl = 'rooms';

  constructor(private http: HttpClient) {
  }

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<RoomModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<RoomModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(room => new RoomModel(room));
          return res;
        })
      );
  }

  findById(id: number): Observable<RoomModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<RoomModel>(url);
  }

  changeStatus(id: number, statusId: number): Observable<void> {
    const url = `${this.url}/change-status/${id}`;
    return this.http.patch<void>(url, { statusId });
  }
}
