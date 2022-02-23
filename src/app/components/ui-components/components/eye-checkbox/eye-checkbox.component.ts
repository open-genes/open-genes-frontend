import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-eye-checkbox',
  templateUrl: './eye-checkbox.component.html',
  styleUrls: ['./eye-checkbox.component.scss'],
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
