import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent {
  @Input() switch = false;
  @Output() changeEvent = new EventEmitter<boolean>();

  toggle() {
    this.switch = !this.switch;
    this.changeEvent.emit(this.switch);
  }
}
