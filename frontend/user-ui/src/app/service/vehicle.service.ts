import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { VehicleResponse, Truck, Trailer, VehicleImage } from '../model/vehicle-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private baseURL: string = 'http://localhost:8181/api/vehicle';

  constructor(private httpClient: HttpClient) { }

  retrieveVehicleInformation(userId: number): Observable<VehicleResponse> {
    return this.httpClient.get<VehicleResponse>(this.baseURL + "/info/" + userId);
  }

  submitTruckData(userId: number, truck: Truck): Observable<Truck> {
    return this.httpClient.post<Truck>(this.baseURL + "/" + userId, truck);
  }

  submitTrailerData(vehicleId: string, trailer: Trailer): Observable<Trailer> {
    return this.httpClient.post<Trailer>(this.baseURL + "/trailer/" + vehicleId, trailer);
  }

  submitImageData(vehicleId: string, vehicleImage: FormData): Observable<HttpEvent<VehicleImage>> {
    return this.httpClient.post<VehicleImage>(this.baseURL + "/image/" + vehicleId, vehicleImage, {
      reportProgress: true,
      observe: 'events',
    });
  }

  deleteVehicleInformation(vehicleId: string) {
    return this.httpClient.delete(this.baseURL + "/delete/" + vehicleId)
  }

  updateTruckInformation(vehicleId: string, truck: Truck): Observable<Truck> {
    return this.httpClient.patch<Truck>(this.baseURL + "/truck/" + vehicleId, truck);
  }

  updateTrailerInformation(vehicleId: string, trailer: Trailer): Observable<Trailer> {
    return this.httpClient.patch<Trailer>(this.baseURL + "/trailer/" + vehicleId, trailer);
  }

  updateImageInformation(vehicleId: string, imageInfo: VehicleImage): Observable<VehicleImage> {
    return this.httpClient.patch<VehicleImage>(this.baseURL + "/image-info/" + vehicleId, imageInfo);
  }

  uploadOnlyImage(vehicleId: string, file: FormData): Observable<HttpEvent<VehicleImage>> {
    return this.httpClient.post<VehicleImage>(this.baseURL + "/single-image/" + vehicleId, file, {
      reportProgress: true,
      observe: 'events',
    });
  }

  deleteVehicleImage(vehicleId: string) {
    return this.httpClient.delete(this.baseURL + "/delete-image/" + vehicleId)
  }
}
