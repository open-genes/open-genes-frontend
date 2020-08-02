import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html'
})

export class ReferenceComponent implements OnInit {
  @Input() gene: any;

  constructor() { }

  ngOnInit() {

  }

}
