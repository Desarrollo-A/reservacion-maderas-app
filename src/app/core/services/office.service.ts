import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { map, Observable } from "rxjs";
import { OfficeModel } from "../models/office.model";
import { PaginationResponse } from "../interfaces/pagination-response";
import { getPaginateParams } from "../../shared/utils/http-functions";
import { OfficeModule } from "../../dashboard/office/office.module";

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private _baseUrl = 'offices';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  getOfficeByStateWithDriver(stateId: number): Observable<OfficeModel[]> {
    const url = `${this.url}/state-driver/${stateId}`;
    return this.http.get<OfficeModel[]>(url);
  }

  getByStateWithDriverWithoutOffice(officeId: number): Observable<OfficeModel[]> {
    const url = `${this.url}/state-driver-whitout-office/${officeId}`;
    return this.http.get<OfficeModel[]>(url);
  }

  getOfficeByStateWithDriverAndCar(stateId: number, noPeople: number): Observable<OfficeModel[]> {
    const url = `${this.url}/state-driver-car/${stateId}/${noPeople}`;
    return this.http.get<OfficeModel[]>(url);
  }

  getOfficeByStateWithCar(stateId: number, noPeople: number): Observable<OfficeModel[]> {
    const url = `${this.url}/state-car/${stateId}/${noPeople}`;
    return this.http.get<OfficeModel[]>(url);
  }

  getOfficeByStateWithDriverAndCarWithoutOffice(officeId: number, noPeople: number): Observable<OfficeModel[]> {
    const url = `${this.url}/state-driver-car-without-office/${officeId}/${noPeople}`;
    return this.http.get<OfficeModel[]>(url);
  }

  getOfficeByStateWithCarWithoutOffice(officeId: number, noPeople: number): Observable<OfficeModel[]> {
    const url = `${this.url}/state-car-without-office/${officeId}/${noPeople}`;
    return this.http.get<OfficeModel[]>(url);
  }

  getAllOffices(): Observable<OfficeModel[]>{
    const url = `${this.url}/all`;
    return this.http.get<OfficeModel[]>(url);
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<OfficeModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<OfficeModel>>(this.url, { params })
      .pipe(
        map(res => {
          res.data = res.data.map(office => new OfficeModel(office));
          return res;
        })
      );
  }

  store(data: OfficeModel): Observable<OfficeModel> {
    return this.http.post<OfficeModel>(this.url, data);
  }

  findById(id: number): Observable<OfficeModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<OfficeModel>(url);
  }

  update(id: number, data: OfficeModel): Observable<OfficeModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<OfficeModel>(url, data);
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        map(() => true)
      );
  }
}
