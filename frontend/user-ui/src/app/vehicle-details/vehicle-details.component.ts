import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Trailer, Truck, TruckInput, VehicleResponse } from '../model/vehicle-dto';
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
  truckInput!: TruckInput;
  vehicleIsEmpty: boolean = false;
  vehicleId: string = '';

  validateTrailerFrom: boolean = false;
  validateImageFrom: boolean = false;

  editModeTruck: boolean = false;

  editModeTrailer: boolean = false;

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
            this.vehicleIsEmpty = true;
          })
      }
    });
  }

  editImageInfo() {
    this.editModeImageInfo = true;
    this.imageInfoEditForm.setValue({
      name: this.vehicle?.image.vehicleImageName,
      description: this.vehicle?.image.vehicleImageDescription,
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
              this.vehicle.image.vehicleImageDirectLink = '';
              this.vehicle.image.vehicleImagePublicId = '';
            }
          })
      }
    });
  }
}
