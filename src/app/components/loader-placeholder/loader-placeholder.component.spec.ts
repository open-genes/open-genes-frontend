import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderPlaceholderComponent } from './loader-placeholder.component';

describe('LoaderPlaceholderComponent', () => {
  let component: LoaderPlaceholderComponent;
  let fixture: ComponentFixture<LoaderPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
