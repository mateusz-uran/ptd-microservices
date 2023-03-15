import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDto, UserFormDto, UserInfoDto } from '../model/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL: string = 'http://localhost:8181/api/user';

  private usersList = new BehaviorSubject<Array<String>>([]);

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(this.baseURL + "/all")
      .pipe(tap((users: Array<string>) => {
        this.usersList.next(users);
      }));
  }

  getAllUsersInfo(): Observable<Array<UserInfoDto>> {
    return this.httpClient.get<Array<UserInfoDto>>(this.baseURL + "/all-info");
  }

  getUserInformation(username: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(this.baseURL + "/" + username);
  }

  toggleUserActiveStatus(userId: number): Observable<boolean> {
    return this.httpClient.post<boolean>(this.baseURL + "/" + userId, null);
  }

  addUser(userDto: UserFormDto): Observable<UserDto> {
    return this.httpClient.post<UserDto>(this.baseURL, userDto)
    .pipe(tap((userDto: UserDto) => {
      const users = this.usersList.getValue();
      users.push(userDto.username);
      this.usersList.next(users);
    }))
  }

  updateUser(userDto: UserFormDto): Observable<UserDto> {
    return this.httpClient.patch<UserDto>(this.baseURL + "/update", userDto);
  }
}
