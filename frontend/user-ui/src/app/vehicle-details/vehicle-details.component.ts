import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { VehicleResponse } from '../model/vehicle-dto';
import { VehicleService } from '../service/vehicle.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { FormGroup, FormControl } from '@angular/forms';

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

  editMode: boolean = false;
  truckEditForm!: FormGroup;

  constructor(private vehicleService: VehicleService, private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges) {
    this.userId = changes['userId'].currentValue;
    this.getVehicleInfo(this.userId);
  }

  ngOnInit(): void {
    this.getVehicleInfo(this.userId);

    this.truckEditForm = new FormGroup({
      id: new FormControl(''),
      model: new FormControl(''),
      type: new FormControl(''),
      licensePlate: new FormControl(''),
      leftTankFuelCapacity: new FormControl(''),
      rightTankFuelCapacity: new FormControl(''),
      adBlueCapacity: new FormControl('')
    });
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
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vehicleService.deleteVehicleInformation(this.vehicleId)
          .subscribe(() => {
            this.vehicle = undefined;
            this.vehicleIsEmpty = true;
          })
      }
    });
  }

  editTruck() {
    this.editMode = true;
    this.truckEditForm.setValue({
      id: this.vehicleId,
      model: this.vehicle?.truck.model,
      type: this.vehicle?.truck.type,
      licensePlate: this.vehicle?.truck.licensePlate,
      leftTankFuelCapacity: this.vehicle?.truck.leftTankFuelCapacity,
      rightTankFuelCapacity: this.vehicle?.truck.rightTankFuelCapacity,
      adBlueCapacity: this.vehicle?.truck.adBlueCapacity,
    })
  }

  saveEditedTruck() {
    this.editMode = false;
    this.vehicleService.updateTruckInformation(this.truckEditForm.value)
      .subscribe({
        next: (data) => {
          if(this.vehicle !== undefined) {
            this.vehicle.truck = data;
          }
          this.editMode = false;
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}
