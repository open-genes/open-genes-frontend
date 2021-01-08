import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CodeBlockComponent } from "./code-block.component";

describe("CodeComponent", () => {
  let component: CodeBlockComponent;
  let fixture: ComponentFixture<CodeBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CodeBlockComponent],
    });
    fixture = TestBed.createComponent(CodeBlockComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    void expect(component).toBeTruthy();
  });
});
