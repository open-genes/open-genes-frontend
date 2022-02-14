import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicationInfoComponent } from './publication-info.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PublicationInfoComponent', () => {
  let component: PublicationInfoComponent;
  let fixture: ComponentFixture<PublicationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [PublicationInfoComponent],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
