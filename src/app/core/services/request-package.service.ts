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
import { Lookup } from "../interfaces/lookup";
import { CancelRequestModel } from "../models/cancel-request.model";
import { ApprovedPackageRequest } from "../../dashboard/history/interfaces/approved-package-request";
import { AuthCodePackage } from 'src/app/package/interfaces/auth-code-package';
import { DeliveredPackage } from 'src/app/package/interfaces/delivered-package';
import { DeliveredPackageModel } from "../models/delivered-package.model";

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

  findById(requestId: number): Observable<PackageModel> {
    const url = `${this.url}/${requestId}`;
    return this.http.get<PackageModel>(url).pipe(
      map(res => new PackageModel(res))
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

  transferRequest(packageId: number, data: { officeId: number }): Observable<void> {
    const url = `${this.url}/transfer/${packageId}`;
    return this.http.patch<void>(url, data);
  }

  getPackagesByDriverId(driverId: number, date: string): Observable<PackageModel[]> {
    const url = `${this.url}/driver/${driverId}/${date}`;
    return this.http.get<PackageModel[]>(url);
  }

  approvedPackageRequest(data: ApprovedPackageRequest): Observable<void> {
    const url = `${this.url}/approved`;
    return this.http.post<void>(url, data);
  }

  insertRequestPackageScore(requestId: number, score: number, comment: string): Observable<void>{
    const request = {requestId, score, comment};
    const url = `${this.url}/insert-score`;
    return this.http.post<void>(url, request);
  }

  isPackageRequestCompleted(requestPackageId: number): Observable<boolean>{
    const url = `${this.url}/completed/${requestPackageId}`;
    return this.http.get<DeliveredPackage>(url)
      .pipe(
        map(res => res.deliveredPackage)
      );
  }

  isAuthCodePackage(requestAuthCodePackage: string): Observable<boolean>{
    const url = `${this.url}/auth-code/${requestAuthCodePackage}`;
    return this.http.get<AuthCodePackage>(url)
      .pipe(
        map(res=>res.authCodePackage)
      );
  }

  showCodePackage(packageId: number): Observable<{code: string}>{
    const url = `${this.url}/show/${packageId}`;
    return this.http.get<{code: string}>(url);
  }

  onRoadPackage(requestId: number): Observable<void> {
    const url = `${this.url}/road/${requestId}`;
    return this.http.patch<void>(url, null);
  }

  findAllByDateAndOffice(officeId: number, date: string): Observable<PackageModel[]> {
    const url = `${this.url}/date/${officeId}/${date}`;
    return this.http.get<PackageModel[]>(url);
  }

  responseRejectRequest(requestId: number, data: RequestModel): Observable<void> {
    const url = `${this.url}/response-reject/${requestId}`;
    return this.http.patch<void>(url, data);
  }

  findAllByDriverPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
  : Observable<PaginationResponse<RequestPackageViewModel>> {
  const params = getPaginateParams(sort, itemsPerPage, page, search);
  const url = `${this.url}/driver`;
  return this.http.get<PaginationResponse<RequestPackageViewModel>>(url, {params})
    .pipe(
      map(res => {
        res.data = res.data.map(requestPackage => new RequestPackageViewModel(requestPackage));
        return res;
      })
    );
  }

  findAllDeliveredByDriverIdPaginated(sort: string, itemsPerPage: number, page: number, search: string | null)
  : Observable<PaginationResponse<RequestPackageViewModel>> {
  const params = getPaginateParams(sort, itemsPerPage, page, search);
  const url = `${this.url}/driver-delivered`;
  return this.http.get<PaginationResponse<RequestPackageViewModel>>(url, {params})
    .pipe(
      map(res => {
        res.data = res.data.map(requestPackage => new RequestPackageViewModel(requestPackage));
        return res;
      })
    );
  }

  deliveredPackage(data: DeliveredPackageModel): Observable<void> {
    const url = `${this.url}/delivered`;
    return this.http.post<void>(url, data);
  }

  uploadSignature(data: DeliveredPackageModel): Observable<void> {
    const formData = new FormData();
    formData.append('signatureFile', data.signatureFile);
    formData.append('_method', 'PUT');
    const url = `${this.url}/signature/${data.packageId}`;
    return this.http.post<void>(url, formData);
  }

  findAllPackagesByManagerIdPaginated(
    sort: string, itemsPerPage: number, page: number, search: string | null
  ): Observable<PaginationResponse<RequestPackageViewModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);
    const url = `${this.url}/department-manager`

    return this.http.get<PaginationResponse<RequestPackageViewModel>>(url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(requestPackage => new RequestPackageViewModel(requestPackage));
          return res;
        })
      );
  }

  acceptCancelPackage(requestId: number, data: RequestModel): Observable<void> {
    const url = `${this.url}/accept-cancel/${requestId}`;
    return this.http.patch<void>(url, data);
  }
}
