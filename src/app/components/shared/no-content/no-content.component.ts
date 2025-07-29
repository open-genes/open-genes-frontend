import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    TranslateModule,
  ],
})
export class NoContentComponent {
  @Input() title: string;
  @Input() iconUrl: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() isPanel = true;
}
