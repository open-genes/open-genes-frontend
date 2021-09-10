import { Component, Input, OnInit } from '@angular/core';
import { SelectionCriteria } from '../../../core/models/openGenesApi/selection-criteria.model';
import { Base } from '../base';

@Component({
  selector: 'app-selection-criteria',
  templateUrl: './selection-criteria.component.html',
  styleUrls: ['./selection-criteria.component.scss'],
})
export class SelectionCriteriaComponent extends Base implements OnInit {
  @Input() geneCriteria: SelectionCriteria;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setListLength(this.geneCriteria);
    this.putItemsIntoAccordion(this.geneCriteria);
  }
}
