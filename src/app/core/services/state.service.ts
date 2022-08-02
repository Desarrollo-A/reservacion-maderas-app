import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { StateModel } from "../models/state.model";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _baseUrl = 'states';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAll(): Observable<StateModel[]> {
    const url = `${this.url}/get-all`;
    return this.http.get<StateModel[]>(url);
  }
}
