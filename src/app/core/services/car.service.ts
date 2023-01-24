import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginationResponse } from 'src/app/core/interfaces/pagination-response';
import { getPaginateParams } from 'src/app/shared/utils/http-functions';
import { environment } from 'src/environments/environment';
import { CarModel } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private _baseUrl = 'cars';

  constructor(private http: HttpClient) {
  }

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<CarModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<CarModel>>(this.url, {params})
      .pipe(
        map(res => {
          res.data = res.data.map(car => new CarModel(car));
          return res;
        })
      );
  }

  findById(id: number): Observable<CarModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<CarModel>(url);
  }

  changeStatus(id: number, statusId: number): Observable<void> {
    const url = `${this.url}/change-status/${id}`;
    return this.http.patch<void>(url, { statusId });
  }

  store(car: CarModel): Observable<CarModel> {
    return this.http.post<CarModel>(this.url, car);
  }

  update(id: number, car: CarModel): Observable<CarModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<CarModel>(url, car);
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.url}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        map(() => true)
      );
  }

  findAllAvailableByDriverId(driverId: number): Observable<CarModel[]>{
    const url = `${this.url}/available-driver/${driverId}`;
    return this.http.get<CarModel[]>(url);
  }

  getAvailableDriverRequest(driverId: number, startDate: string, endDate: string, people: number): Observable<CarModel[]> {
    const params = new HttpParams()
      .append('start_date', startDate)
      .append('end_date', endDate)
      .append('people', people);
    const url = `${this.url}/available-driver-request/${driverId}`;
    return this.http.get<CarModel[]>(url, {params}).pipe(
      map(cars => cars.map(car => new CarModel(car)))
    );
  }

  getAvailableCarsInRequestCar(officeId: number, startDate: string, endDate: string): Observable<CarModel[]> {
    const params = new HttpParams()
      .append('start_date', startDate)
      .append('end_date', endDate);
    const url = `${this.url}/available-car-request/${officeId}`;
    return this.http.get<CarModel[]>(url, {params}).pipe(
      map(cars => cars.map(car => new CarModel(car)))
    );
  }

  getAvailableCarsInRequestPackage(driverId: number, startDate: string): Observable<CarModel[]> {
    const params = new HttpParams()
      .append('start_date', startDate);
    const url = `${this.url}/available-package-request/${driverId}`;
    return this.http.get<CarModel[]>(url, {params}).pipe(
      map(cars => cars.map(car => new CarModel(car)))
    );
  }

  getAvailableCarsProposalRequest(requestId: number, dateSelected: string): Observable<CarModel[]> {
    const params = new HttpParams()
      .append('date', dateSelected);
    const url = `${this.url}/proposal-request/${requestId}`;
    return this.http.get<CarModel[]>(url, {params}).pipe(
      map(cars => {
        cars = cars.map(car => new CarModel(car));
        return cars;
      })
    );
  }
}
