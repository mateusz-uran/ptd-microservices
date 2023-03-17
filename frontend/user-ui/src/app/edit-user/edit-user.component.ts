import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDto } from '../model/user-dto';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  @Input() user!: UserDto;
  @Output() updateUserInformation = new EventEmitter<UserDto>();
  @Output() mode = new EventEmitter<boolean>();
  userEditForm!: FormGroup;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userEditForm = new FormGroup({
      firstName: new FormControl(this.user.firstName, Validators.required),
      lastName: new FormControl(this.user.lastName, Validators.required),
      username: new FormControl(this.user.username, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
    });
  }

  updateUser() {
    this.userService.updateUser(this.userEditForm.value)
    .subscribe({
      next: (data) => {
        this.updateUserInformation.emit(data);
        this.mode.emit(false);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }
}
