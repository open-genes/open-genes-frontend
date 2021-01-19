import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-deprecated-descriptions",
  templateUrl: "./manual-descriptions.component.html",
})
export class ManualDescriptionsComponent {
  @Input() public gene: any;

  constructor(public translate: TranslateService) {}
}
