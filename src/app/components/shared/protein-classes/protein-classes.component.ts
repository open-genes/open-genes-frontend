import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProteinClasses } from '../../../core/models/open-genes-api/genes.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrap-into-accordion';

@Component({
  selector: 'app-aging-mechanisms',
  templateUrl: './protein-classes.component.html',
  styleUrls: ['./protein-classes.component.scss'],
})
export class ProteinClassesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneProteinClasses: ProteinClasses;
  @Input() activeListItem: string;
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  public mappedProteinClasses: Map<string, any> = new Map();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.mapProteinClasses();
    this.setListLength(this.geneProteinClasses);
    this.putItemsIntoAccordion(this.geneProteinClasses);
  }

  private mapProteinClasses(): void {
    for (const [key, value] of Object.entries(this.geneProteinClasses)) {
      this.mappedProteinClasses.set(key, value);
    }
  }

  public emitOnClick(mechanismKey: string): void {
    this.clickEvent.emit(mechanismKey);
  }
}
