import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { ErrorResponse } from "../interfaces/error-response";
import { Router } from "@angular/router";
import { UserSessionService } from "../services/user-session.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { ConfigService } from "../../shared/config/config.service";
import { VexConfigName } from "../../shared/config/config-name.model";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService,
              private router: Router,
              private userSessionService: UserSessionService,
              private navigationService: NavigationService,
              private configService: ConfigService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.toastr.error('Favor de comunicarse con el administrador', 'Error');
            return throwError(() => error.error);
          }

          this.errorHandling(error);

          if (error.status === 401) { // No autorizado
            this.userSessionService.removeToken();
            this.userSessionService.clearUser();
            this.navigationService.clearItems();
            this.configService.removeTemplateConfig();
            this.configService.setConfig(VexConfigName.poseidon);
            this.router.navigateByUrl('/auth');

          } else if (error.status === 403) { // No tiene permisos
            this.router.navigateByUrl('/dashboard');
          }

          return throwError(() => error.error);
        })
      );
  }

  public errorHandling(error: HttpErrorResponse): void {
    const errors = error.error as ErrorResponse;

    if (typeof errors.error === 'string') {
      if (error.status !== 500) {
        this.toastr.warning(errors.error, 'Atención');
      } else {
        this.toastr.error(errors.error, 'Error');
      }
    } else {
      Object.entries(errors.error!).forEach(([, msgs]) => {
        const messages = msgs as string[];
        messages.forEach(msg => {
          this.toastr.warning(msg, 'Validación');
        });
      });
    }
  }
}
