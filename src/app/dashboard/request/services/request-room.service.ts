import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { RequestModel } from "../models/request.model";

@Injectable({
  providedIn: 'root'
})
export class RequestRoomService {
  private _baseUrl = 'request-rooms';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  store(data: RequestModel): Observable<void> {
    return this.http.post<void>(this.url, data);
  }
}
