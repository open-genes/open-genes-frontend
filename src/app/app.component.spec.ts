import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [AppComponent],
      });
      fixture = TestBed.createComponent(AppComponent);
    })
  );

  it('should create the app', () => {
    void expect(fixture.debugElement.componentInstance).toBeTruthy();
  });
});
