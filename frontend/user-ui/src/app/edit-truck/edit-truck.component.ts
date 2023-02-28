import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Truck } from '../model/vehicle-dto';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-edit-truck',
  templateUrl: './edit-truck.component.html',
  styleUrls: ['./edit-truck.component.css']
})
export class EditTruckComponent implements OnInit {

  @Input() truck!: Truck
  @Output() mode = new EventEmitter<boolean>();
  @Output() updatedTruck = new EventEmitter<Truck>();
  truckEditForm!: FormGroup;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {

    this.truckEditForm = new FormGroup({
      id: new FormControl(this.truck.id),
      model: new FormControl(this.truck.model),
      truckType: new FormControl(this.truck.truckType),
      truckLicensePlate: new FormControl(this.truck.truckLicensePlate),
      leftTankFuelCapacity: new FormControl(this.truck.leftTankFuelCapacity),
      rightTankFuelCapacity: new FormControl(this.truck.rightTankFuelCapacity),
      adBlueCapacity: new FormControl(this.truck.adBlueCapacity)
    });
  }

  saveEditedTruck() {
    this.vehicleService.updateTruckInformation(this.truck.id, this.truckEditForm.value)
      .subscribe({
        next: (data) => {
          this.updatedTruck.emit(data);
          this.mode.emit(false);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}
