import { Component, Input } from "@angular/core";

@Component({
  selector: "app-reference",
  templateUrl: "./reference.component.html",
  styleUrls: ["./reference.component.scss"],
})
export class ReferenceComponent {
  @Input() gene: any;

  constructor() {
    // empty
  }
}
