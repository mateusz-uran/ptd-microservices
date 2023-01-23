import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { VehicleResponse } from '../model/vehicle-dto';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  @Input() userId: number = 0;

  vehicle?: VehicleResponse;
  vehicleIsEmpty: boolean = false;
  vehicleId: string = '';

  validateTrailerFrom: boolean = false;
  validateImageFrom: boolean = false;

  constructor(private vehicleService: VehicleService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.userId = changes['userId'].currentValue;
    this.getVehicleInfo(this.userId);
  }

  ngOnInit(): void { 
    this.getVehicleInfo(this.userId);
  }

  getVehicleInfo(id: any) {
    this.vehicleService.retrieveVehicleInformation(id)
      .subscribe({
        next: (data) => {
          this.vehicle = data;
          this.vehicleIsEmpty = false;
          this.vehicleId = data.truck.id;
          this.validateTrailerFrom = Object.values(data.trailer).every(o => o === null);
          this.validateImageFrom = Object.values(data.image).every(o => o === null);
        },
        error: (e) => {
          this.vehicleIsEmpty = true;
          console.log(e)
        }
      })
  }

  deleteVehicle() {
    this.vehicleService.deleteVehicleInformation(this.vehicleId)
    .subscribe(() => {
      this.vehicle = undefined;
      this.vehicleIsEmpty = true;
    })
  }
}
