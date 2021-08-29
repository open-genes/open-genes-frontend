import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
})
export class HintComponent {
  @Input() hintType: 'emphasized' | ''; // TODO: use enumerated type
}
