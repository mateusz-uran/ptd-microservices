import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  userForm!: FormGroup;
  
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  submitUser() {
    this.userService.addUser(this.userForm.value)
    .subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }
}
