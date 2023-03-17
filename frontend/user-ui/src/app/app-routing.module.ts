import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddImageDetailsComponent } from './add-image-details/add-image-details.component';
import { AddTrailerDetailsComponent } from './add-trailer-details/add-trailer-details.component';
import { AddTruckDetailsComponent } from './add-truck-details/add-truck-details.component';
import { AddUserComponent } from './add-user/add-user.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardService],
    children: [
      {
        path: 'new-user', component: AddUserComponent
      },
      {
        path: 'user-details/:username', component: UserDetailsComponent,
      },
      {
        path: 'user-details/:username/add-truck/:userId', component: AddTruckDetailsComponent
      },
      {
        path: 'user-details/:username/add-trailer/:vehicleId', component: AddTrailerDetailsComponent
      },
      {
        path: 'user-details/:username/add-image/:vehicleId', component: AddImageDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
