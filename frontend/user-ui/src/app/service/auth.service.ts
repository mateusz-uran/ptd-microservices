import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { authConfig } from '../auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticationEventObservable: Subject<boolean> = new Subject<boolean>();

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public loginUser() {
    if (!this.isAuthenticated()) {
      this.oauthService.initCodeFlow();
    }
  }

  public logoutUser() {
    this.oauthService.revokeTokenAndLogout();
  }

  public isAuthenticated(): boolean {
    if (
      this.oauthService.hasValidAccessToken() &&
      this.oauthService.hasValidIdToken()
    ) {
      return true;
    } else {
      return false;
    }
  }
}
