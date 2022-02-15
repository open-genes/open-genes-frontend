import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeCheckboxComponent } from './eye-checkbox.component';

describe('EyeCheckboxComponent', () => {
  let component: EyeCheckboxComponent;
  let fixture: ComponentFixture<EyeCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
