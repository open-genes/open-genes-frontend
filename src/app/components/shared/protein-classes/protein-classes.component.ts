import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProteinClasses } from '../../../core/models/open-genes-api/genes.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrap-into-accordion';

@Component({
  selector: 'app-protein-classes',
  templateUrl: './protein-classes.component.html',
  styleUrls: ['./protein-classes.component.scss'],
})
export class ProteinClassesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneProteinClasses: ProteinClasses[];
  @Input() activeListItem: any[];
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setListLength(this.geneProteinClasses);
    this.putItemsIntoAccordion(this.geneProteinClasses);
  }

  public emitOnClick(mechanismKey: string): void {
    this.clickEvent.emit(mechanismKey);
  }
}
