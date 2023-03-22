import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoDto } from '../model/user-dto';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userInfo: UserInfoDto[] = [];

  constructor(
    private userService: UserService, 
    private notificationService: NotificationService,
    private webSocketService: WebsocketService, 
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.userService.getAllUsersInfo()
      .subscribe(data => {
        this.userInfo = data;
      })
    this.connect();
  }

  connect(): void {
    this.webSocketService.connect();

    this.notificationService.notificationMessage.subscribe((data) => {
      this.snackBar.open("User " + data.cardAuthor + " toggled card: " + data.cardNumber, "OK");
    })
  }

  disconnect(): void {
    this.webSocketService.disconnect();
  }
}
