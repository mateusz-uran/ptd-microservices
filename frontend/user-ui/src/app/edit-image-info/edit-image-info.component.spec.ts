import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImageInfoComponent } from './edit-image-info.component';

describe('EditImageInfoComponent', () => {
  let component: EditImageInfoComponent;
  let fixture: ComponentFixture<EditImageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditImageInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditImageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
