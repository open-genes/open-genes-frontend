import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-code-block',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  private codeStrings: string;
  @Input()
  text: string;

  constructor() {
  }

  ngOnInit() {
  }
}
