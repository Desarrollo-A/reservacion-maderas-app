import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UserModel } from "../models/user.model";
import { Observable } from "rxjs";
import { UserSession } from "../interfaces/user-session";
import { PaginationResponse } from "../interfaces/pagination-response";
import { getPaginateParams } from "../../shared/utils/http-functions";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _baseUrl = 'users';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<UserModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);

    return this.http.get<PaginationResponse<UserModel>>(this.url, { params })
      .pipe(
        map(res => {
          res.data = res.data.map(user => new UserModel(user))
          return res;
        })
      );
  }

  store(data: UserModel): Observable<UserSession> {
    return this.http.post<UserSession>(this.url, data);
  }

  getDataProfile(): Observable<UserModel> {
    const url = `${this.url}/profile`;
    return this.http.get<UserModel>(url);
  }

  findByid(id: number): Observable<UserModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<UserModel>(url);
  }

  update(id: number, data: UserModel): Observable<UserModel> {
    const url = `${this.url}/${id}`;
    return this.http.put<UserModel>(url, data);
  }

  findAllDepartmentManagers(): Observable<UserModel[]> {
    const url = `${this.url}/department-manager`;
    return this.http.get<UserModel[]>(url);
  }

  findAllUserPermissionPaginated(sort: string, itemsPerPage: number, page: number, search: string | null): Observable<PaginationResponse<UserModel>> {
    const params = getPaginateParams(sort, itemsPerPage, page, search);
    const url = `${this.url}/permission`;

    return this.http.get<PaginationResponse<UserModel>>(url, { params })
      .pipe(
        map(res => {
          res.data = res.data.map(user => new UserModel(user))
          return res;
        })
      );
  }
}
