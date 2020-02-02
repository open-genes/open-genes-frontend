import {Component, Input, OnInit} from '@angular/core';
import {LOADER_TYPES} from './conf/loader-types.enum';

@Component({
  selector: 'app-loader-placeholder',
  templateUrl: './loader-placeholder.component.html',
  styleUrls: ['./loader-placeholder.component.scss']
})
export class LoaderPlaceholderComponent implements OnInit {
  @Input()
  type = LOADER_TYPES.loader;

  @Input()
  groups: number;

  quantity = Array;

  constructor() { }

  ngOnInit() {
  }

}
