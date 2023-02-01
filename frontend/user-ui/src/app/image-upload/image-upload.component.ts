import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleService } from '../service/vehicle.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent {

  @Input() vehicleId!: string;
  @Output() uploadedImage = new EventEmitter<string>();

  currentFile!: File;
  progress: number = 0;
  value = 0;

  constructor(private vehicleService: VehicleService, private _snackBar: MatSnackBar) { }


  onChange(event: any) {
    this.currentFile = event.target.files[0];
  }

  uploadImage() {
    const formData = new FormData();

    formData.append('file', this.currentFile);

    this.vehicleService.uploadOnlyImage(this.vehicleId, formData)
      .subscribe({
        next: (data: any) => {
          if (data.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * data.loaded / data.total);
          } else if (data instanceof HttpResponse) {
            if (data.body.vehicleImageDirectLink == null) {
              this._snackBar.open("Add image information first!", "OK");
            } else {
              this.uploadedImage.emit(data.body.vehicleImageDirectLink);
            }
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}

