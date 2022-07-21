import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssociatedDiseases } from '../../../core/models/open-genes-api/associated-diseases.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrap-into-accordion';

@Component({
  selector: 'app-associated-diseases',
  templateUrl: './associated-diseases.component.html',
  styleUrls: ['./associated-diseases.component.scss'],
})
export class AssociatedDiseasesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneDiseases: AssociatedDiseases[];
  @Input() activeListItem: number[];
  @Output() clickEvent: EventEmitter<number> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.setListLength(this.geneDiseases);
    this.putItemsIntoAccordion(this.geneDiseases);
  }

  public emitOnClick(diseaseId: number): void {
    this.clickEvent.emit(diseaseId);
  }
}
