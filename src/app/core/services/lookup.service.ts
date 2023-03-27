import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { Lookup } from "../interfaces/lookup";

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private _baseUrl = 'lookups';

  constructor(private http: HttpClient) {}

  get url(): string {
    return environment.baseUrl + environment.api + this._baseUrl;
  }

  findAllByType(type: number): Observable<Lookup[]> {
    const url = `${this.url}/find-all-type/${type}`;
    return this.http.get<Lookup[]>(url);
  }

  findByCodeAndType(code: string, type: number): Observable<Lookup> {
    const url = `${this.url}/find-by-code-type/${type}/${code}`;
    return this.http.get<Lookup>(url);
  }
}
