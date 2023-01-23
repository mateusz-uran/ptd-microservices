import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImageDetailsComponent } from './add-image-details.component';

describe('AddImageDetailsComponent', () => {
  let component: AddImageDetailsComponent;
  let fixture: ComponentFixture<AddImageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddImageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddImageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
