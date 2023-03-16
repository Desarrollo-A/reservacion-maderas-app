import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, map } from "rxjs";
import { RequestModel } from "../models/request.model";
import { RequestCarModel } from "../models/request-car.model";
import { RequestCarViewModel } from '../models/request-car-view.model';
import { PaginationResponse } from '../interfaces/pagination-response';
import { getPaginateParams } from 'src/app/shared/utils/http-functions';
import { Lookup } from "../interfaces/lookup";
import { CancelRequestModel } from "../models/cancel-request.model";
import { ApprovedCarRequest } from "../../dashboard/history/interfaces/approved-car-request";
import { ProposalCarDriverRequest } from "../../dashboard/history/interfaces/proposal-car-driver-request";

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

  transferRequest(requestCarId: number, data: { officeId: number }): Observable<void> {
    const url = `${this.url}/transfer/${requestCarId}`;
    return this.http.patch<void>(url, data);
  }

  getStatusByStatusCurrent(code: string): Observable<Lookup[]> {
    const url = `${this.url}/status/${code}`;
    return this.http.get<Lookup[]>(url);
  }

  cancelRequest(requestId: number, request: CancelRequestModel): Observable<void> {
    const url = `${this.url}/cancel/${requestId}`;
    return this.http.patch<void>(url, request);
  }

  approvedRequest(requestCar: ApprovedCarRequest): Observable<void> {
    const url = `${this.url}/approved`;
    return this.http.post<void>(url, requestCar);
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

  uploadZipImages(id: number, zip: File): Observable<void> {
    const formData = new FormData();
    formData.append('imageZipFile', zip);
    formData.append('_method', 'PUT');

    const url = `${this.url}/upload-zip/${id}`;
    return this.http.post<void>(url, formData);
  }

  addExtraCarInformation(id: number, data: RequestCarModel): Observable<void> {
    const url = `${this.url}/extra-information/${id}`;
    return this.http.patch<void>(url, data);
  }
}
