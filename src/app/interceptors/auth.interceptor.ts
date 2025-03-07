import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.authService.user) {
      return next.handle(request);
    }
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        const modifiedRequest = request.clone({
          params: new HttpParams().set('auth', user?.token || '')
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
