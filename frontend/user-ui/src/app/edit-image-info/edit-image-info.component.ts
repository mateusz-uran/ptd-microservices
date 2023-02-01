import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VehicleImage } from '../model/vehicle-dto';
import { VehicleService } from '../service/vehicle.service';
@Component({
  selector: 'app-edit-image-info',
  templateUrl: './edit-image-info.component.html',
  styleUrls: ['./edit-image-info.component.css']
})
export class EditImageInfoComponent implements OnInit {

  @Input() imageInfo!: VehicleImage 
  @Input() vehicleId!: string; 
  @Output() mode = new EventEmitter<boolean>();
  @Output() updatedImageInfo = new EventEmitter<VehicleImage>();
  imageInfoEditForm!: FormGroup;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.imageInfoEditForm = new FormGroup({
      vehicleImageName: new FormControl(this.imageInfo.vehicleImageName),
      vehicleImageDescription: new FormControl(this.imageInfo.vehicleImageDescription)
    });
  }

  saveEditedImageInfo() {
    this.vehicleService.updateImageInformation(this.vehicleId, this.imageInfoEditForm.value)
      .subscribe({
        next: (data) => {
          this.updatedImageInfo.emit(data);
          this.mode.emit(false);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}
