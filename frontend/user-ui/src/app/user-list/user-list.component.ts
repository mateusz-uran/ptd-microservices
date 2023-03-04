import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'angular-oauth2-oidc';
import { UserInfoDto } from '../model/user-dto';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userInfo: UserInfoDto[] = [];
  colors = [
    '#eb7181',
    '#468547',
    '#ffd558',
    '#3670b2',
  ]

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsersInfo()
      .subscribe(data => {
        this.userInfo = data;
        this.createInitials();
      })
  }

  createInitials(): void {
    for (const user of this.userInfo) {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const initials = this.getInitials(firstName) + this.getInitials(lastName);
      user.initials = initials;
      user.color = this.generateColor();
    }
  }

  private generateColor(): string {
    const randomInex = Math.floor(Math.random() * Math.floor(this.colors.length));
    return this.colors[randomInex];
  }

  private getInitials(name: string): string {
    const parts = name.split(' ');
    let initials = '';
    for (let i = 0; i < parts.length; i++) {
      initials += parts[i][0];
    }
    return initials.toUpperCase();
  }
}
