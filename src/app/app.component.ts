import { Component, AfterViewChecked, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { LoggingService } from './core/services/logging-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewChecked {
  private lang: string;

  constructor(
    private renderer: Renderer2,
    private translate: TranslateService,
    private loggingService: LoggingService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.translate.addLangs(environment.languages);
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else if (
      navigator.language.substring(0, 2) === 'en' ||
      navigator.language.substring(0, 2) === 'ru'
    ) {
      this.lang = navigator.language.substring(0, 2);
    } else {
      this.lang = environment.languages[1];
    }
    this.translate.use(this.lang);
    // Logging example:
    // this.loggingService.sendMessage({ message: `Language is ${this.lang}`, type: 'info' });
  }

  ngAfterViewChecked(): void {
    this.renderer.removeClass(document.body, 'body--loading');
  }
}
