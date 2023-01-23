import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { VehicleResponse, Truck, Trailer, VehicleImage } from '../model/vehicle-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private httpClient: HttpClient) { }

  retrieveVehicleInformation(userId: number): Observable<VehicleResponse> {
    return this.httpClient.get<VehicleResponse>("http://localhost:8080/api/vehicle/info/" + userId);
  }

  submitTruckData(userId: number, truck: Truck): Observable<Truck> {
    return this.httpClient.post<Truck>("http://localhost:8080/api/vehicle/" + userId, truck);
  }

  submitTrailerData(vehicleId: string, trailer: Trailer): Observable<Trailer> {
    return this.httpClient.post<Trailer>("http://localhost:8080/api/vehicle/trailer/" + vehicleId, trailer);
  }

  submitImageData(vehicleId: string, vehicleImage: FormData): Observable<HttpEvent<VehicleImage>> {
    return this.httpClient.post<VehicleImage>("http://localhost:8080/api/vehicle/image/" + vehicleId, vehicleImage, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
