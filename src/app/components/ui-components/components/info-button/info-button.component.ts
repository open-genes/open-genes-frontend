import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.scss'],
})
export class InfoButtonComponent implements OnInit {
  @Input() visible = false;
  @Output() btnEvent: EventEmitter<Event> = new EventEmitter<Event>();
  constructor() {}

  ngOnInit(): void {}
}
