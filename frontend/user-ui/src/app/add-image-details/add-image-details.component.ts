import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleService } from '../service/vehicle.service';

@Component({
  selector: 'app-add-image-details',
  templateUrl: './add-image-details.component.html',
  styleUrls: ['./add-image-details.component.css']
})
export class AddImageDetailsComponent implements OnInit {

  imageForm!: FormGroup;
  currentFile!: File;
  retrieviedVehicleId: string = '';
  retrieviedUsername: string = '';

  constructor(private router: Router, private route: ActivatedRoute,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.retrieviedVehicleId = params['vehicleId'];
      this.retrieviedUsername = params['username'];
    })

    this.imageForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
    });
  }

  onChange(event: any) {
    this.currentFile = event.target.files[0];
  }
  submitImage() {
    const formData = new FormData();
    console.log(this.imageForm.value);
    console.log(this.currentFile)
    formData.append('description', JSON.stringify(this.imageForm.value))
    formData.append('image', this.currentFile);

    this.vehicleService.submitImageData(this.retrieviedVehicleId, formData)
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
