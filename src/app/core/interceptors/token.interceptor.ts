import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSessionService } from "../services/user-session.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private userSessionService: UserSessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const apiToken = this.userSessionService.token;

    if (apiToken === '') {
      return next.handle(request);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${apiToken}`
    });

    const reqClone = request.clone({ headers });

    return next.handle(reqClone);
  }
}
