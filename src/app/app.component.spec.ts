import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    void TestBed.configureTestingModule({
      declarations: [AppComponent],
    });
    fixture = TestBed.createComponent(AppComponent);
  }));

  it("should create the app", () => {
    void expect(fixture.debugElement.componentInstance).toBeTruthy();
  });

  it("should render title", () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement.querySelector(
      ".content span"
    );
    void expect(compiled.textContent).toContain("frontend app is running!");
  });
});
