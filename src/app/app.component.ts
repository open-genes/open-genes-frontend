import { Component, AfterViewChecked } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements AfterViewChecked {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(environment.languages);
    const lang = localStorage.getItem("lang") || environment.languages[0];
    this.translate.use(lang);
  }

  public ngAfterViewChecked(): void {
    setTimeout(() => {
      // TODO: find a proper way to wait for the full DOM loading considering all modules
      document.body.classList.remove("body--loading");
    }, 500);
  }
}
