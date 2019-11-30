import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(environment.languages);
    const lang = localStorage.getItem('lang') || environment.languages[0];
    this.translate.use(lang);
  }

  ngAfterViewInit() {
    document.getElementById('loader').style.display = 'none';
  }

}
