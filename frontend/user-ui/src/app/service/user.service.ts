import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDto, UserFormDto, UserInfoDto } from '../model/user-dto';
import { createInitials } from '../utility/avatat-utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL: string = 'http://localhost:8181/api/user';

  public usersInfoList = new BehaviorSubject<Array<UserInfoDto>>([]);
  

  constructor(private httpClient: HttpClient) { }

  getAllUsersInfo(): Observable<Array<UserInfoDto>> {
    return this.httpClient.get<Array<UserInfoDto>>(this.baseURL + "/all-info")
    .pipe(
      tap((users: Array<UserInfoDto>) => {
        this.usersInfoList.next(users);
        createInitials(this.usersInfoList.getValue())
      })
    );
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
      const users = this.usersInfoList.getValue();
      users.push(userDto);
      this.usersInfoList.next(users);
      
      createInitials(this.usersInfoList.getValue())
    }))
  }

  updateUser(userDto: UserFormDto): Observable<UserDto> {
    return this.httpClient.patch<UserDto>(this.baseURL + "/update", userDto);
  }
}
