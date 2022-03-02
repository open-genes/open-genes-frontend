import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssociatedDiseaseCategories } from '../../../core/models/open-genes-api/associated-diseases.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrap-into-accordion';

@Component({
  selector: 'app-associated-disease-categories',
  templateUrl: './associated-disease-categories.component.html',
  styleUrls: ['./associated-disease-categories.component.scss'],
})
export class AssociatedDiseaseCategoriesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneDiseaseCategories: AssociatedDiseaseCategories;
  @Input() activeListItem: string[];
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  public mappedDiseaseCategories: Map<number, any> = new Map();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.mapDiseaseCategories();
    this.setListLength(this.geneDiseaseCategories);
    this.putItemsIntoAccordion(this.geneDiseaseCategories);
  }

  // TODO: OG-661. Это поменяется при переходе на новую версию api/gene/search (будет массивом объектов)
  private mapDiseaseCategories(): void {
    for (const [key, value] of Object.entries(this.geneDiseaseCategories)) {
      this.mappedDiseaseCategories.set(+key, value);
    }
  }

  public emitOnClick(disCategoriesKey: string): void {
    this.clickEvent.emit(disCategoriesKey);
  }
}
