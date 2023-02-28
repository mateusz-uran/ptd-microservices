import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UserDto } from '../model/user-dto';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userId!: number;
  username!: string;
  userDto: UserDto = {
    id: 0,
    username: ''
  };

  editModeUser: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.retrieveUserInformation(params['username'])
    })
  }

  retrieveUserInformation(username: string) {
    this.userService.getUserInformation(username)
      .subscribe(data => {
        this.userDto = data;
        this.userId = data.id;
        this.username = data.username;
      })
  }

  toggleUser() {
    this.userService.toggleUserActiveStatus(this.userDto.id)
      .subscribe(data => {
        this.userDto.active = data;
        let message = data ? "active" : "inactive";
        this.snackBar.open("User is now " + message, "OK");
      })
  }
}
