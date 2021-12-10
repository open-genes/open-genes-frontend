import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [TranslateModule.forRoot()],
        providers: [TranslateService],
      });
      fixture = TestBed.createComponent(AppComponent);
    })
  );

  it('should create the app', () => {
    void expect(fixture.debugElement.componentInstance).toBeTruthy();
  });
});
