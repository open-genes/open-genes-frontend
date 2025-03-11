import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssociatedDiseases } from '../../../core/models/open-genes-api/associated-diseases.model';
import { WrapIntoAccordion } from '../../ui-components/accordion/wrap-into-accordion';
import { NgForOf, NgIf, SlicePipe } from '@angular/common';
import { AccordionComponent } from '../../ui-components/accordion/accordion.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-associated-diseases',
  templateUrl: './associated-diseases.component.html',
  styleUrls: ['./associated-diseases.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AccordionComponent,
    SlicePipe,
    TranslateModule,
  ],
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
