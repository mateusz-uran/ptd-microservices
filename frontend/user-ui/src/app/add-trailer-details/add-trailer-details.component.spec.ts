import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrailerDetailsComponent } from './add-trailer-details.component';

describe('AddTrailerDetailsComponent', () => {
  let component: AddTrailerDetailsComponent;
  let fixture: ComponentFixture<AddTrailerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrailerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrailerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
