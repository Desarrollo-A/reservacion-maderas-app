import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { SummaryDay } from "../interfaces/summary-day";

@Injectable({
  providedIn: 'root'
})
export class QuickpanelService {
  public events$ = new BehaviorSubject<SummaryDay[]>([]);

  constructor() {}
}
