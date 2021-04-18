import { Component, Input, OnInit } from '@angular/core';
import { SelectionCriteria } from '../../../core/models/selection-criteria.model';

@Component({
  selector: 'app-selection-criteria',
  templateUrl: './selection-criteria.component.html',
  styleUrls: ['./selection-criteria.component.scss']
})
export class SelectionCriteriaComponent implements OnInit {
  @Input() geneCriteria: SelectionCriteria;
  public commentCauseLength: number = 0;
  public isAccordion: boolean = false;
  public maxItemsToShow: number = 1;
  public isAccordionOpen: boolean;

  constructor() { }

  ngOnInit(): void {
    this.setCriteriaListLength(this.geneCriteria);
    this.setIfPutItemsIntoAccordion(this.geneCriteria);
  }

  private setCriteriaListLength(criteria: SelectionCriteria): void {
    if (criteria) {
      this.commentCauseLength = Object.keys(criteria).length;
    }
  }

  private setIfPutItemsIntoAccordion(criteria: SelectionCriteria): void {
    if (criteria && this.commentCauseLength !== 0) {
      if (this.commentCauseLength > this.maxItemsToShow) {
        // Avoid a case when there is only one item left inside an accordion.
        // In this case we show the whole list.
        this.isAccordion = this.commentCauseLength - this.maxItemsToShow !== 1;
      } else {
        this.isAccordion = false;
      }
    }
  }

  public toggleAccordion(event: boolean): void {
    this.isAccordionOpen = event;
  }
}
