import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Trailer, Truck, VehicleResponse } from '../model/vehicle-dto';
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

  vehicle: VehicleResponse | undefined;
  vehicleIsEmpty: boolean = false;
  vehicleId: string = '';

  validateTrailerFrom: boolean = false;
  validateImageFrom: boolean = false;

  editModeTruck: boolean = false;
  truckEditForm!: FormGroup;

  editModeTrailer: boolean = false;
  trailerEditForm!: FormGroup;

  editModeImageInfo: boolean = false;
  imageInfoEditForm!: FormGroup;

  currentFile!: File;
  progress: number = 0;

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

    this.trailerEditForm = new FormGroup({
      id: new FormControl(''),
      type: new FormControl(''),
      licensePlate: new FormControl(''),
      fuelCapacity: new FormControl('')
    });

    this.imageInfoEditForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
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
            console.log(this.vehicle);
            this.vehicle = undefined;
            console.log(this.vehicle);
            this.vehicleIsEmpty = true;
          })
      }
    });
  }

  editTruck() {
    this.editModeTruck = true;
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

  editTrailer() {
    this.editModeTrailer = true;
    this.trailerEditForm.setValue({
      id: this.vehicleId,
      type: this.vehicle?.trailer.type,
      licensePlate: this.vehicle?.trailer.licensePlate,
      fuelCapacity: this.vehicle?.trailer.fuelCapacity,
    })
  }

  editImageInfo() {
    this.editModeImageInfo = true;
    this.imageInfoEditForm.setValue({
      name: this.vehicle?.image.name,
      description: this.vehicle?.image.description,
    })
  }

  saveEditedTruck() {
    this.editModeTruck = false;
    this.vehicleService.updateTruckInformation(this.truckEditForm.value)
      .subscribe({
        next: (data) => {
          if (this.vehicle !== undefined) {
            this.vehicle.truck = data;
          }
          this.editModeTruck = false;
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  saveEditedTrailer() {
    this.editModeTrailer = false;
    this.vehicleService.updateTrailerInformation(this.vehicleId, this.trailerEditForm.value)
      .subscribe({
        next: (data) => {
          if (this.vehicle !== undefined) {
            this.vehicle.trailer = data;
          }
          this.editModeTrailer = false;
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  saveEditedImageInfo() {
    this.editModeImageInfo = true;
    this.vehicleService.updateImageInformation(this.vehicleId, this.imageInfoEditForm.value)
      .subscribe({
        next: (data) => {
          if (this.vehicle !== undefined) {
            this.vehicle.image = data;
          }
          this.editModeImageInfo = false;
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  onChange(event: any) {
    this.currentFile = event.target.files[0];
  }

  uploadImage() {
    const formData = new FormData();

    formData.append('file', this.currentFile);

    this.vehicleService.uploadOnlyImage(this.vehicleId, formData)
      .subscribe({
        next: (data) => {
          if (this.vehicle !== undefined) {
            this.vehicle.image = data;
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
  }

  deleteVehicleImage() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vehicleService.deleteVehicleImage(this.vehicleId)
          .subscribe(() => {
            if (this.vehicle !== undefined) {
              this.vehicle.image.link = '';
              this.vehicle.image.publicImageId = '';
            }
          })
      }
    });
  }
}
