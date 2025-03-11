import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssociatedDiseaseCategories } from '../../../core/models/open-genes-api/associated-diseases.model';
import { WrapIntoAccordion } from '../../ui-components/accordion/wrap-into-accordion';
import { NgClass, NgForOf, NgIf, SlicePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../ui-components/accordion/accordion.component';

@Component({
  selector: 'app-associated-disease-categories',
  templateUrl: './associated-disease-categories.component.html',
  styleUrls: ['./associated-disease-categories.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AccordionComponent,
    SlicePipe,
    TranslateModule,
  ],
})
export class AssociatedDiseaseCategoriesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneDiseaseCategories: AssociatedDiseaseCategories[];
  public filteredItems: AssociatedDiseaseCategories[];
  @Input() activeListItem: number[];
  @Output() clickEvent: EventEmitter<number> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.filteredItems = this.geneDiseaseCategories.filter((d) => {
      return d.icdCategoryName.length > 0 || d.icdCode.length > 0
    });
    this.setListLength(this.filteredItems);
    this.putItemsIntoAccordion(this.filteredItems);
  }

  public emitOnClick(disCategoriesId: number): void {
    this.clickEvent.emit(disCategoriesId);
  }
}
