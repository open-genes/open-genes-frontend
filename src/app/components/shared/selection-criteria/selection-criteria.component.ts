import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectionCriteria } from '../../../core/models/open-genes-api/genes.model';
import { WrapIntoAccordion } from '../../ui-components/accordion/wrap-into-accordion';

@Component({
  selector: 'app-selection-criteria',
  templateUrl: './selection-criteria.component.html',
  styleUrls: ['./selection-criteria.component.scss'],
})
export class SelectionCriteriaComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneCriteria: SelectionCriteria[];
  @Input() activeListItem: number[];
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setListLength(this.geneCriteria);
    this.putItemsIntoAccordion(this.geneCriteria);
  }

  public emitOnClick(criteriaKey: string): void {
    this.clickEvent.emit(criteriaKey);
  }
}
