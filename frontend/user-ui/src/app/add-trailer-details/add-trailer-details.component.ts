import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-add-trailer-details',
  templateUrl: './add-trailer-details.component.html',
  styleUrls: ['./add-trailer-details.component.css']
})
export class AddTrailerDetailsComponent implements OnInit {

  trailerForm!: FormGroup;
  retrieviedVehicleId: string = '';
  retrieviedUsername: string = '';

  constructor(private router: Router, private route: ActivatedRoute,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.retrieviedVehicleId = params['vehicleId'];
      this.retrieviedUsername = params['username'];
    })

    this.trailerForm = new FormGroup({
      trailerType: new FormControl(''),
      trailerLicensePlate: new FormControl(''),
      trailerFuelCapacity: new FormControl(''),
    });
  }

  submitTrailer() {
    this.vehicleService.submitTrailerData(this.retrieviedVehicleId, this.trailerForm.value)
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
