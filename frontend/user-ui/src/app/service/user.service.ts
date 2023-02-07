import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../model/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>("http://localhost:8080/api/user/all");
  }

  getUserInformation(username: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>("http://localhost:8080/api/user/" + username);
  }

  toggleUserActiveStatus(userId: number): Observable<boolean> {
    return this.httpClient.post<boolean>("http://localhost:8080/api/user/" +  userId, null);
  }
}
