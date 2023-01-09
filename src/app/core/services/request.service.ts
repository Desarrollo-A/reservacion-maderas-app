import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RequestModel } from "../models/request.model";
import { ScoreModel } from "../models/score.model";

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _baseUrl = 'requests';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findById(id: number): Observable<RequestModel> {
    const url = `${this.url}/${id}`;
    return this.http.get<RequestModel>(url);
  }

  deleteRequestRoom(id: number): Observable<boolean> {
    const url = `${this.url}/room/${id}`;
    return this.http.delete<boolean>(url).pipe(
      map(() => true)
    );
  }

  deleteRequestPackage(requestId: number): Observable<boolean> {
    const url = `${this.url}/package/${requestId}`;
    return this.http.delete<void>(url).pipe(
      map(() => true)
    );
  }

  deleteRequestDriver(requestId: number): Observable<boolean> {
    const url = `${this.url}/driver/${requestId}`;
    return this.http.delete<void>(url).pipe(
      map(() => true)
    );
  }

  starRatingRequest(data: ScoreModel): Observable<void> {
    const url = `${this.url}/rating`;
    return this.http.post<void>(url, data);
  }
}
