import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PaginationResponse } from "../interfaces/pagination-response";
import { RoomModel } from "../models/room.model";
import { getPaginateParams } from "../../shared/utils/http-functions";
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

  findAllByState(stateId: number): Observable<RoomModel[]> {
    const url = `${this.url}/find-all-state/${stateId}`;
    return this.http.get<RoomModel[]>(url);
  }

  changeStatus(id: number, statusId: number): Observable<void> {
    const url = `${this.url}/change-status/${id}`;
    return this.http.patch<void>(url, { statusId });
  }

  store(room: RoomModel): Observable<RoomModel> {
    return this.http.post<RoomModel>(this.url, room);
  }

  update(id: number, room: RoomModel): Observable<RoomModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<RoomModel>(url, room);
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        map(() => true)
      );
  }
}
