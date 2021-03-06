import { Component, Input } from "@angular/core";

@Component({
  selector: "app-code-block",
  templateUrl: "./code-block.component.html",
  styleUrls: ["./code-block.component.scss"],
})
export class CodeBlockComponent {
  @Input()
  text: string;
}
