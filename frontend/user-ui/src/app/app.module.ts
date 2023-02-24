import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserListComponent } from './user-list/user-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddTruckDetailsComponent } from './add-truck-details/add-truck-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddTrailerDetailsComponent } from './add-trailer-details/add-trailer-details.component';
import { AddImageDetailsComponent } from './add-image-details/add-image-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { EditControlsComponent } from './edit-controls/edit-controls.component';
import { EditTruckComponent } from './edit-truck/edit-truck.component';
import { EditTrailerComponent } from './edit-trailer/edit-trailer.component';
import { EditImageInfoComponent } from './edit-image-info/edit-image-info.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthConfig, OAuthModule, OAuthService } from "angular-oauth2-oidc";
import { InterceptorService } from './service/interceptor.service';
import { CachingInterceptorService } from './service/caching.interceptor.service';
import { authConfig } from './auth.config';
import { AuthService } from './service/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    NavbarComponent,
    HomeComponent,
    UserDetailsComponent,
    VehicleDetailsComponent,
    AddTruckDetailsComponent,
    AddTrailerDetailsComponent,
    AddImageDetailsComponent,
    DialogContentComponent,
    EditControlsComponent,
    EditTruckComponent,
    EditTrailerComponent,
    EditImageInfoComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
