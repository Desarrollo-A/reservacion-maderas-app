import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { RequestModel } from "../models/request.model";
import { PaginationResponse } from "../../../core/interfaces/pagination-response";
import { RequestRoomViewModel } from "../../history/models/request-room-view.model";
import { getPaginateParams } from "../../../shared/utils/http-functions";
import { map } from "rxjs/operators";
import { RequestRoomModel } from "../models/request-room.model";
import { Lookup } from "../../../core/interfaces/lookup";
import { InventoryRequestModel } from "../../history/models/inventory-request.model";
import { AvailableScheduleModel } from "../../history/models/available-schedule.model";

@Injectable({
  providedIn: 'root'
})
export class RequestRoomService {
  private _baseUrl = 'request-rooms';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
    : Observable<PaginationResponse<RequestRoomViewModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<RequestRoomViewModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(requestRoom => new RequestRoomViewModel(requestRoom));
          return res;
        })
      );
  }

  store(data: RequestModel): Observable<void> {
    return this.http.post<void>(this.url, data);
  }

  findByRequestId(id: number): Observable<RequestRoomModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<RequestRoomModel>(url)
      .pipe(
        map(res => new RequestRoomModel(res))
      );
  }

  getStatusByStatusCurrent(code: string): Observable<Lookup[]> {
    const url = `${this.url}/status/${code}`;
    return this.http.get<Lookup[]>(url);
  }

  assignSnacks(requestRoom: {requestId: number, inventoryRequest: InventoryRequestModel[]}): Observable<void> {
    const url = `${this.url}/assign-snack`;
    return this.http.post<void>(url, requestRoom);
  }

  availableRoom(request: RequestModel): Observable<RequestModel> {
    const url = `${this.url}/available-room`;
    return this.http.post<RequestModel>(url, request);
  }

  cancelRequest(id: number, request: RequestModel): Observable<void> {
    const url = `${this.url}/cancel/${id}`;
    return this.http.patch<void>(url, request);
  }

  getAvailableSchedule(id: number, date: string): Observable<AvailableScheduleModel[]> {
    const url = `${this.url}/schedule/${id}/${date}`;
    return this.http.get<AvailableScheduleModel[]>(url).pipe(
      map(res => {
        res = res.map(available => new AvailableScheduleModel(available));
        return res;
      })
    );
  }

  proposalRequest(id: number, data: RequestModel): Observable<void> {
    const url = `${this.url}/proposal/${id}`;
    return this.http.patch<void>(url, data);
  }

  withoutAttendingRequest(id: number): Observable<void> {
    const url = `${this.url}/without-attending/${id}`;
    return this.http.patch<void>(url, null);
  }
}
