import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectionCriteria } from '../../../core/models/openGenesApi/selection-criteria.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrapIntoAccordion';

@Component({
  selector: 'app-selection-criteria',
  templateUrl: './selection-criteria.component.html',
  styleUrls: ['./selection-criteria.component.scss'],
})
export class SelectionCriteriaComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneCriteria: SelectionCriteria;
  @Input() activeListItem: any;
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setListLength(this.geneCriteria);
    this.putItemsIntoAccordion(this.geneCriteria);
  }

  public emitOnClick(criteriaName: any): void {
    this.clickEvent.emit(criteriaName);
  }
}
