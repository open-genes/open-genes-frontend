import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loader-placeholder',
  templateUrl: './loader-placeholder.component.html',
  styleUrls: ['./loader-placeholder.component.scss']
})
export class LoaderPlaceholderComponent implements OnInit {
  @Input()
  loader: string;

  @Input()
  groups: number;

  quantity = Array;

  constructor() { }

  ngOnInit() {
  }

}
