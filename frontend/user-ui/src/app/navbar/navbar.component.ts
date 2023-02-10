import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  checkIfUserIsLoggedIn: boolean = false;

  constructor(private authService: AuthService, private oauthService: OAuthService) { }

  ngOnInit(): void {
    this.checkIfUserIsLoggedIn = this.oauthService.hasValidAccessToken();
  }

  public login() {
    this.authService.loginUser();
  }

  public logoff() {
    this.authService.logoutUser();
  }
}
