import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  standalone: true,
  imports: [
    NgClass,
  ],
})
export class TagComponent {
  @Input() isMultiline: boolean;
  @Input() isActive: boolean;
  @Input() isDisabled: boolean;
}
