import { Component, Input, OnInit } from '@angular/core';
import { AssociatedDiseaseCategories } from '../../../core/models/openGenesApi/associated-diseases.model';
import { Base } from '../base';

@Component({
  selector: 'app-associated-disease-categories',
  templateUrl: './associated-disease-categories.component.html',
  styleUrls: ['./associated-disease-categories.component.scss'],
})
export class AssociatedDiseaseCategoriesComponent extends Base implements OnInit {
  @Input() geneDiseaseCategories: AssociatedDiseaseCategories;

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
}
