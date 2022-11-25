import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingMap: Map<string, boolean> = new Map<string, boolean>();

  constructor() {}

  setLoading(isLoading: boolean, url: string): void {
    if (isLoading) {
      this.loadingMap.set(url, isLoading);
      this.isLoading$.next(true);
    } else if (!isLoading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }

    if (this.loadingMap.size === 0) {
      this.isLoading$.next(false);
    }
  }
}
