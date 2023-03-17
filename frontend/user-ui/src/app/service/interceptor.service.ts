import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, from, Observable, switchMap, take, throwError } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private oauthService: OAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.oauthService.getAccessToken()
    const isApiUrlUser = request.url.includes("user");
    const isApiUrlVehicle = request.url.includes("vehicle");
    if (token && isApiUrlUser || isApiUrlVehicle) {
      return next.handle(request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      }))
    }

    return next.handle(request);
  }
}

