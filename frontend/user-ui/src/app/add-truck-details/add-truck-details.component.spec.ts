import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTruckDetailsComponent } from './add-truck-details.component';

describe('AddTruckDetailsComponent', () => {
  let component: AddTruckDetailsComponent;
  let fixture: ComponentFixture<AddTruckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTruckDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTruckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
