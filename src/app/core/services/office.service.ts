import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { OfficeModel } from "../models/office.model";

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
}
