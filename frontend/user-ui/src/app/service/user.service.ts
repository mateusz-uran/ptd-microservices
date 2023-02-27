import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../model/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL: string = 'http://localhost:8181/api/user';

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(this.baseURL + "/all");
  }

  getUserInformation(username: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(this.baseURL + "/" + username);
  }

  toggleUserActiveStatus(userId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(this.baseURL + "/" +  userId, null);
  }
}
