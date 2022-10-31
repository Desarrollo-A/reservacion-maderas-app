import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HomeModel } from "../models/home.model";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private _baseUrl = 'home';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  getDataHome(): Observable<HomeModel> {
    return this.http.get<HomeModel>(this.url);
  }
}
