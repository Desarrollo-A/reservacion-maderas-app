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
import { NotificationService } from "../../shared/layout/toolbar/toolbar-notifications/services/notification.service";
import { PusherService } from "../services/pusher.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService,
              private router: Router,
              private userSessionService: UserSessionService,
              private navigationService: NavigationService,
              private configService: ConfigService,
              private notificationService: NotificationService,
              private pusherService: PusherService) {}

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
            this.notificationService.notifications$.next([]);
            this.router.navigateByUrl('/auth');
            this.pusherService.disconnectPusher();

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

      return;
    }

    if (errors.error instanceof Map) {
      Object.entries(errors.error!).forEach(([, msgs]) => {
        const messages = msgs as string[];
        messages.forEach(msg => {
          this.toastr.warning(msg, 'Validación');
        });
      });
    }

    if (error.error instanceof Blob) {
      this.errorBlob(error);
      return;
    }
  }

  async errorBlob(error) {
    const errorObj: ErrorResponse = JSON.parse(await error.error.text());

    if (typeof errorObj.error === 'string') {
      this.toastr.warning(errorObj.error, 'Atención');
    }
  }
}
