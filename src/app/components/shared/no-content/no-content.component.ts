import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss'],
})
export class NoContentComponent implements OnInit {
  @Input() title: string;
  @Input() iconUrl: string;

  constructor() {}

  ngOnInit(): void {}
}
