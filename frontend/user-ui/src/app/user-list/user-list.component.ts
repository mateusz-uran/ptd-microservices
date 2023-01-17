import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserDto } from '../model/user-dto';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userDto: UserDto[] = [];

  constructor(private userService: UserService) {  }

  ngOnInit(): void {
    this.getListOfUsers();
  }

  getListOfUsers() {
    this.userService.getAllUsers()
    .subscribe(data => {
      this.userDto = data;
    })
  }
}
