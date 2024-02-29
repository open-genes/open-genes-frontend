import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-subtitle',
  templateUrl: './page-subtitle.component.html',
  styleUrls: ['./page-subtitle.component.scss'],
})
export class PageSubtitleComponent {
  @Input() title: string;
}