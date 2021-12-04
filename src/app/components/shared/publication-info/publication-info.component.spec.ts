import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationInfoComponent } from './publication-info.component';

describe('PublicationInfoComponent', () => {
  let component: PublicationInfoComponent;
  let fixture: ComponentFixture<PublicationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
