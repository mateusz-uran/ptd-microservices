import { Component, Input, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Truck, TruckInput } from '../model/vehicle-dto';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-edit-controls',
  templateUrl: './edit-controls.component.html',
  styleUrls: ['./edit-controls.component.css']
})
export class EditControlsComponent implements OnInit {

  @Input() truck!: any  
  @Output() mode = new EventEmitter<boolean>();
  @Output() updatedTruck = new EventEmitter<Truck>();
  truckEditForm!: FormGroup;
  truckProperties: string[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.truckProperties = Object.keys(this.truck);

    const formControls: { [key: string | number]: FormControl } = {};
    this.truckProperties.forEach(property => {
      formControls[property] = new FormControl(this.truck[property]);
    });
    this.truckEditForm = new FormGroup(formControls);

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
