import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleService } from '../service/vehicle.service';
import {
  HttpEventType, HttpResponse
} from "@angular/common/http";

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
  progress: number = 0;

  constructor(private router: Router, private route: ActivatedRoute,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.retrieviedVehicleId = params['vehicleId'];
      this.retrieviedUsername = params['username'];
    })

    this.imageForm = new FormGroup({
      vehicleImageName: new FormControl(''),
      vehicleImageDescription: new FormControl(''),
    });
  }

  onChange(event: any) {
    this.currentFile = event.target.files[0];
  }
  
  submitImage() {
    const formData = new FormData();

    formData.append('description', new Blob([JSON.stringify(this.imageForm.value)], {type: 'application/json'}))
    formData.append('image', this.currentFile);

    this.vehicleService.submitImageData(this.retrieviedVehicleId, formData)
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.router.navigate(['/user-details/', this.retrieviedUsername]);
          }
        },
        error: (e) => {
          console.log(e);
        }
      })
  }
}
