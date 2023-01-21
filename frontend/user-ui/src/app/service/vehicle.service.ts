import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { VehicleResponse } from '../model/vehicle-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private httpClient: HttpClient) { }

  retrieveVehicleInformation(userId: number): Observable<VehicleResponse> {
    return this.httpClient.get<VehicleResponse>("http://localhost:8080/api/vehicle/info/" + userId);
  }
}
