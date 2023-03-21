import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import { NotificationService } from './notification.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  stompClient: any;

  constructor(private notificationService: NotificationService) { }
  

  connect(): void {
    const webSocketEndpoint = new SockJS('http://localhost:8181/api/notification');

    this.stompClient = Stomp.over(webSocketEndpoint);
    const _this = this;
    _this.stompClient.connect({}, function() {
      _this.stompClient.subscribe('/topic/notify', function(sdkEvent: any) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallback);
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("disconnected");
  }

  errorCallback(error: any) {
    setTimeout(() => {
      this.connect();
    }, 5000)
  }

  onMessageReceived(message: any) {
    this.notificationService.notificationMessage.emit(JSON.parse(message.body));
  }
}
