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
  @Input() activeListItem: string;
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  public mappedAgingMechanisms: Map<string, any> = new Map();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.mapAgingMechanisms();
    this.setListLength(this.geneAgingMechanisms);
    this.putItemsIntoAccordion(this.geneAgingMechanisms);
  }

  private mapAgingMechanisms(): void {
    if (this.geneAgingMechanisms) {
      this.geneAgingMechanisms.forEach((mechanism) => {
        this.mappedAgingMechanisms.set(mechanism.id, mechanism.name);
      });
    }
  }

  public emitOnClick(mechanismKey: string): void {
    this.clickEvent.emit(mechanismKey);
  }
}
