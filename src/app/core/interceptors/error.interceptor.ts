import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { ErrorResponse } from "../interfaces/error-response";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error) => {
          this.errorHandling(error);
          return throwError(() => error.error);
        })
      );
  }

  public errorHandling(error: HttpErrorResponse): void {
    const errors = error.error as ErrorResponse;

    if (typeof errors.error === 'string') {
      this.toastr.error(errors.error, 'Error');
    } else {
      Object.entries(errors.error!).forEach(([, msgs]) => {
        const messages = msgs as string[];
        messages.forEach(msg => {
          this.toastr.error(msg, 'Validación');
        });
      });
    }
  }
}
