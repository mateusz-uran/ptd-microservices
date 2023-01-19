import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDto } from '../model/user-dto';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDto!: UserDto;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.retrieveUserInformation(params['username'])
    })
  }

  retrieveUserInformation(username: string) {
    this.userService.getUserInformation(username)
      .subscribe(data => {
        this.userDto = data;
      })
  }
}
