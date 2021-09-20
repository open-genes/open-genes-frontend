import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssociatedDiseaseCategories } from '../../../core/models/openGenesApi/associated-diseases.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrapIntoAccordion';

@Component({
  selector: 'app-associated-disease-categories',
  templateUrl: './associated-disease-categories.component.html',
  styleUrls: ['./associated-disease-categories.component.scss'],
})
export class AssociatedDiseaseCategoriesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneDiseaseCategories: AssociatedDiseaseCategories;
  @Input() activeListItem: string;
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

  public mappedDiseaseCategories: Map<string, any> = new Map();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.mapDiseaseCategories();
    this.setListLength(this.geneDiseaseCategories);
    this.putItemsIntoAccordion(this.geneDiseaseCategories);
  }

  private mapDiseaseCategories(): void {
    for (const [key, value] of Object.entries(this.geneDiseaseCategories)) {
      this.mappedDiseaseCategories.set(key, value);
    }
  }

  public emitOnClick(diseaseKey: string): void {
    this.clickEvent.emit(diseaseKey);
  }
}
