import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { getPaginateParams } from 'src/app/shared/utils/http-functions';
import { environment } from 'src/environments/environment';
import { PaginationResponse } from '../interfaces/pagination-response';
import { DriverModel } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private _baseUrl = 'drivers';

  constructor(private http: HttpClient) {}

  get url(): string{
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<DriverModel>>{
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<DriverModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(driver => new DriverModel(driver));
          return res;
        })
      );
  }

  findById(id: number): Observable<DriverModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<DriverModel>(url);
  }

  insertDriverCar(carId: number, driverId: number): Observable<void>{
    const request = {carId, driverId};
    const url = `${this.url}/car`;
    return this.http.post<void>(url, request);
  }

  getAvailablePackageRequest(officeId: number, date: string): Observable<DriverModel[]> {
    const url = `${this.url}/available-package/${officeId}/${date}`;
    return this.http.get<DriverModel[]>(url).pipe(
      map(drivers => {
        drivers = drivers.map(driver => new DriverModel(driver));
        return drivers;
      })
    );
  }

  getAvailableDriverRequest(officeId: number, startDate: string, endDate: string): Observable<DriverModel[]> {
    const params = new HttpParams()
      .append('start_date', startDate)
      .append('end_date', endDate);
    const url = `${this.url}/available-request/${officeId}`;
    return this.http.get<DriverModel[]>(url, {params}).pipe(
      map(drivers => {
        drivers = drivers.map(driver => new DriverModel(driver));
        return drivers;
      })
    );
  }
}
