import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Trailer } from '../model/vehicle-dto';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-edit-trailer',
  templateUrl: './edit-trailer.component.html',
  styleUrls: ['./edit-trailer.component.css']
})
export class EditTrailerComponent implements OnInit {

  @Input() trailer!: Trailer 
  @Input() vehicleId!: string; 
  @Output() mode = new EventEmitter<boolean>();
  @Output() updatedTrailer = new EventEmitter<Trailer>();
  trailerEditForm!: FormGroup;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.trailerEditForm = new FormGroup({
      trailerType: new FormControl(this.trailer.trailerType),
      trailerLicensePlate: new FormControl(this.trailer.trailerLicensePlate),
      trailerFuelCapacity: new FormControl(this.trailer.trailerFuelCapacity)
    });
  }

  saveEditedTrailer() {
    this.vehicleService.updateTrailerInformation(this.vehicleId, this.trailerEditForm.value)
      .subscribe({
        next: (data) => {
          this.updatedTrailer.emit(data);
          this.mode.emit(false);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}
