import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-eye-checkbox',
  templateUrl: './eye-checkbox.component.html',
  styleUrls: ['./eye-checkbox.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    TranslateModule,
  ],
})
export class EyeCheckboxComponent {
  @Input() switch = false;
  @Output() changeEvent = new EventEmitter<boolean>();

  public toggle(event) {
    this.switch = !this.switch;
    this.changeEvent.emit(this.switch);
    event.stopPropagation();
  }
}
