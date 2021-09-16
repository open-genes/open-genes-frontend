import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {
  @Input() switch: boolean = false;
  @Output() change = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }


  toggle() {
    this.switch = !this.switch;
    this.change.emit(this.switch);
  }
}
