import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import {LanguageComponent} from "../language/language.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
    imports: [TranslateModule, RouterLinkWithHref, RouterLinkActive, LanguageComponent],
})
export class FooterComponent {
  @Input() appData: { build: string; version: string };

  constructor(
    public translate: TranslateService,
  ) {}
}
