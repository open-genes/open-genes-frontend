import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchChartComponent } from './research-chart.component';

describe('ResearchChartComponent', () => {
  let component: ResearchChartComponent;
  let fixture: ComponentFixture<ResearchChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
