import { Component, Input, OnInit } from '@angular/core';
import { IGen } from '../../core/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() dataSource: IGen[];

  constructor() { }

  ngOnInit() {

  }
}
