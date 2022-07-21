import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @Input() isMultiline: boolean;
  @Input() isActive: boolean;
  @Input() isDisabled: boolean;

  constructor() {}
}
