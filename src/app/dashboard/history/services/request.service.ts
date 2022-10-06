import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RequestModel } from "../../request/models/request.model";

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

  responseRejectRequest(id: number, data: RequestModel): Observable<void> {
    const url = `${this.url}/response-reject/${id}`;
    return this.http.patch<void>(url, data);
  }
}
