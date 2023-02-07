import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { VehicleResponse, Truck, Trailer, VehicleImage } from '../model/vehicle-dto';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) { }

  retrieveVehicleInformation(userId: number): Observable<VehicleResponse> {
    let token = this.oauthService.getAccessToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const requestOptions = { headers: headers };

    return this.httpClient.get<VehicleResponse>("http://localhost:8080/api/vehicle/info/" + userId, requestOptions);
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

  deleteVehicleInformation(vehicleId: string) {
    return this.httpClient.delete("http://localhost:8080/api/vehicle/delete/" + vehicleId)
  }

  updateTruckInformation(vehicleId: string, truck: Truck): Observable<Truck> {
    return this.httpClient.patch<Truck>("http://localhost:8080/api/vehicle/truck/" + vehicleId, truck);
  }

  updateTrailerInformation(vehicleId: string, trailer: Trailer): Observable<Trailer> {
    return this.httpClient.patch<Trailer>("http://localhost:8080/api/vehicle/trailer/" + vehicleId, trailer);
  }

  updateImageInformation(vehicleId: string, imageInfo: VehicleImage): Observable<VehicleImage> {
    return this.httpClient.patch<VehicleImage>("http://localhost:8080/api/vehicle/image-info/" + vehicleId, imageInfo);
  }

  uploadOnlyImage(vehicleId: string, file: FormData): Observable<HttpEvent<VehicleImage>> {
    return this.httpClient.post<VehicleImage>("http://localhost:8080/api/vehicle/single-image/" + vehicleId, file, {
      reportProgress: true,
      observe: 'events',
    });
  }

  deleteVehicleImage(vehicleId: string) {
    return this.httpClient.delete("http://localhost:8080/api/vehicle/delete-image/" + vehicleId)
  }
}
