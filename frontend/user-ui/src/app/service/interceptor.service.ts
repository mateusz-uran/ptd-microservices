import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private oauthService: OAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request));
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = this.oauthService.getAccessToken();
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
