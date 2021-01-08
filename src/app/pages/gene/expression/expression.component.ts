import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-expression",
  templateUrl: "./expression.component.html",
})
export class ExpressionComponent {
  @Input() public gene: any;
  @Input() public max: number;

  constructor(public translate: TranslateService) {}

  public chartCalculatePercent(a: number, b: number): number {
    return (a / b) * 100;
  }
}
