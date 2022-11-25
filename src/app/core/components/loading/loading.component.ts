import { Component, OnInit } from '@angular/core';
import { delay, Observable } from "rxjs";
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: 'app-loading',
  template: `
    <div class="overlay" *ngIf="isLoading$ | async">
      <span class="loader"></span>
    </div>
  `,
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  public isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.isLoading$ = this.loadingService.isLoading$.asObservable()
      .pipe(
        delay(0)
      );
  }
}
