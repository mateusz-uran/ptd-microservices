import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-add-truck-details',
  templateUrl: './add-truck-details.component.html',
  styleUrls: ['./add-truck-details.component.css']
})
export class AddTruckDetailsComponent implements OnInit {

  truckForm!: FormGroup;
  retrieviedUserId: number = 0;
  retrieviedUsername: string = '';

  constructor(private router: Router, private route: ActivatedRoute,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.retrieviedUserId = params['userId'];
      this.retrieviedUsername = params['username'];
    })

    this.truckForm = new FormGroup({
      model: new FormControl(''),
      truckType: new FormControl(''),
      truckLicensePlate: new FormControl(''),
      leftTankFuelCapacity: new FormControl(''),
      rightTankFuelCapacity: new FormControl(''),
      adBlueCapacity: new FormControl('')
    });
  }

  submitTruck() {
    this.vehicleService.submitTruckData(this.retrieviedUserId, this.truckForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/user-details/', this.retrieviedUsername]);
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}
