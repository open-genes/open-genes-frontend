import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-subtitle',
  templateUrl: './page-subtitle.component.html',
  styleUrls: ['./page-subtitle.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class PageSubtitleComponent {
  @Input() title: string;
}