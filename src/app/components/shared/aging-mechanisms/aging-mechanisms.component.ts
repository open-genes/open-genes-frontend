import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgingMechanisms } from '../../../core/models/open-genes-api/genes.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrap-into-accordion';

@Component({
  selector: 'app-aging-mechanisms',
  templateUrl: './aging-mechanisms.component.html',
  styleUrls: ['./aging-mechanisms.component.scss'],
})
export class AgingMechanismsComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneAgingMechanisms: AgingMechanisms[];
  @Input() activeListItem: any[];
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setListLength(this.geneAgingMechanisms);
    this.putItemsIntoAccordion(this.geneAgingMechanisms);
  }

  public emitOnClick(mechanismKey: string): void {
    this.clickEvent.emit(mechanismKey);
  }
}
