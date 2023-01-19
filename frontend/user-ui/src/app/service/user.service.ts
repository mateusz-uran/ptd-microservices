import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../model/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<Array<UserDto>> {
    return this.httpClient.get<Array<UserDto>>("http://localhost:8080/api/user/all");
  }

  getUserInformation(username: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>("http://localhost:8080/api/user/" + username);
  }
}
