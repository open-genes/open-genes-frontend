import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  standalone: true,
  imports: [
    NgClass,
  ],
})
export class HintComponent {
  @Input() hintType: 'emphasized' | '';
}
