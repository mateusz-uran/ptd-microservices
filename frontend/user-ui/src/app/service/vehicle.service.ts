import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { VehicleResponse, Truck, Trailer, VehicleImage } from '../model/vehicle-dto';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private baseURL: string = 'http://localhost:8181/api/vehicle';

  private vehicleDataSubject = new BehaviorSubject<VehicleResponse>({
    truck: {
      id: '',
      model: '',
      truckType: '',
      truckLicensePlate: '',
      leftTankFuelCapacity: 0,
      rightTankFuelCapacity: 0,
      adBlueCapacity: 0,
    },
    trailer: {
      trailerType: '',
      trailerLicensePlate: '',
      trailerFuelCapacity: '',
    },
    image: {
      vehicleImageName: '',
      vehicleImageDescription: '',
      vehicleImagePublicId: '',
      vehicleImageDirectLink: '',
    }
  });

  constructor(private httpClient: HttpClient) { }

  getVehicleData(): Observable<VehicleResponse> {
    return this.vehicleDataSubject.asObservable();
  }

  retrieveVehicleInformation(userId: number): Observable<VehicleResponse> {
    return this.httpClient.get<VehicleResponse>(this.baseURL + "/info/" + userId).pipe(
      tap(res => {
        this.vehicleDataSubject.next(res);
      })
    );
  }

  submitTruckData(userId: number, truck: Truck): Observable<Truck> {
    return this.httpClient.post<Truck>(this.baseURL + "/" + userId, truck).pipe(
      tap(res => {
        const vehicleData = this.vehicleDataSubject.getValue();
        vehicleData.truck = res;
        this.vehicleDataSubject.next(vehicleData);
      })
    );
  }

  submitTrailerData(vehicleId: string, trailer: Trailer): Observable<Trailer> {
    return this.httpClient.post<Trailer>(this.baseURL + "/trailer/" + vehicleId, trailer).pipe(
      tap(res => {
        const vehicleData = this.vehicleDataSubject.getValue();
        vehicleData.trailer = res;
        this.vehicleDataSubject.next(vehicleData);
      })
    );
  }

  submitImageData(vehicleId: string, vehicleImage: FormData): Observable<HttpEvent<VehicleImage>> {
    return this.httpClient.post<VehicleImage>(this.baseURL + "/image/" + vehicleId, vehicleImage, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      tap((event: HttpEvent<VehicleImage>) => {
        if (event.type === HttpEventType.Response) {
          const vehicleData = this.vehicleDataSubject.getValue();
          if (event.body !== null) {
            vehicleData.image = event.body;
            this.vehicleDataSubject.next(vehicleData);
          }
        }
      })
    );
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
