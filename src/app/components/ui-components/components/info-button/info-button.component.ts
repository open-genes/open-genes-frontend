import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.scss'],
})
export class InfoButtonComponent {
  @Input() visible = false;
  @Output() btnEvent: EventEmitter<Event> = new EventEmitter<Event>();
}
