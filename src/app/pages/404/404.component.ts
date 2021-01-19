import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-error-404",
  templateUrl: "./404.component.html",
})
export class Error404Component {
  constructor(public translate: TranslateService) {}
}
