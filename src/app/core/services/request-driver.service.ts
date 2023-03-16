import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { RequestModel } from "../models/request.model";
import { Observable } from "rxjs";
import { RequestDriverModel } from "../models/request-driver.model";
import { PaginationResponse } from "../interfaces/pagination-response";
import { getPaginateParams } from "../../shared/utils/http-functions";
import { map } from "rxjs/operators";
import { RequestDriverViewModel } from "../models/request-driver-view.model";
import { Lookup } from "../interfaces/lookup";
import { CancelRequestModel } from "../models/cancel-request.model";
import { ApprovedDriverRequest } from "../../dashboard/history/interfaces/approved-driver-request";
import { ProposalCarDriverRequest } from "../../dashboard/history/interfaces/proposal-car-driver-request";

@Injectable({
  providedIn: 'root'
})
export class RequestDriverService {
  private _baseUrl = 'request-drivers';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestModel): Observable<RequestDriverModel> {
    return this.http.post<RequestDriverModel>(this.url, data);
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
    : Observable<PaginationResponse<RequestDriverViewModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<RequestDriverViewModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(requestDriver => new RequestDriverViewModel(requestDriver));
          return res;
        })
      );
  }

  findById(requestId: number): Observable<RequestDriverModel> {
    const url = `${this.url}/${requestId}`;
    return this.http.get<RequestDriverModel>(url).pipe(
      map(res => new RequestDriverModel(res))
    );
  }

  getStatusByStatusCurrent(code: string): Observable<Lookup[]> {
    const url = `${this.url}/status/${code}`;
    return this.http.get<Lookup[]>(url);
  }

  cancelRequest(requestId: number, request: CancelRequestModel): Observable<void> {
    const url = `${this.url}/cancel/${requestId}`;
    return this.http.patch<void>(url, request);
  }

  transferRequest(requestDriverId: number, data: { officeId: number }): Observable<void> {
    const url = `${this.url}/transfer/${requestDriverId}`;
    return this.http.patch<void>(url, data);
  }

  approvedRequest(requestDriver: ApprovedDriverRequest): Observable<void> {
    const url = `${this.url}/approved`;
    return this.http.post<void>(url, requestDriver);
  }

  findAllByDriverIdPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
    : Observable<PaginationResponse<RequestDriverViewModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);
    const url = `${this.url}/driver`;
    return this.http.get<PaginationResponse<RequestDriverViewModel>>(url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(requestDriver => new RequestDriverViewModel(requestDriver));
          return res;
        })
      );
  }

  getBusyDaysForProposalCalendar(): Observable<Date[]> {
    const url = `${this.url}/busy-days`;
    return this.http.get<string[]>(url).pipe(
      map(data => data.map(date => new Date(date)))
    );
  }

  proposalRequest(data: ProposalCarDriverRequest): Observable<void> {
    const url = `${this.url}/proposal`;
    return this.http.patch<void>(url, data);
  }

  responseRejectRequest(requestId: number, data: RequestModel): Observable<void> {
    const url = `${this.url}/response-reject/${requestId}`;
    return this.http.patch<void>(url, data);
  }
}
