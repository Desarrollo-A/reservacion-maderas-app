import { HttpClient } from '@angular/common/http';
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
}
