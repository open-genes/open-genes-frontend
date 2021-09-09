import { Component, Input, OnInit } from '@angular/core';
import { AssociatedDiseaseCategories } from '../../../core/models/openGenesApi/associated-diseases.model';

@Component({
  selector: 'app-associated-disease-categories',
  templateUrl: './associated-disease-categories.component.html',
  styleUrls: ['./associated-disease-categories.component.scss'],
})
export class AssociatedDiseaseCategoriesComponent implements OnInit {
  @Input() geneDiseaseCategories: any;
  public mappedDiseaseCategories: Map<string, any> = new Map();
  public geneDiseaseCategoriesLength: number = 0;
  public isAccordion: boolean = false;
  public maxItemsToShow: number = 1;
  public isAccordionOpen: boolean;

  constructor() {}

  ngOnInit(): void {
    this.mapDiseaseCategories();
    this.setDiseaseListLength(this.geneDiseaseCategories);
    this.setIfPutItemsIntoAccordion(this.geneDiseaseCategories);
  }

  private mapDiseaseCategories(): void {
    for (const [key, value] of Object.entries(this.geneDiseaseCategories)) {
      this.mappedDiseaseCategories.set(key, value);
    }
  }

  private setDiseaseListLength(criteria: AssociatedDiseaseCategories): void {
    if (criteria) {
      this.geneDiseaseCategoriesLength = Object.keys(criteria).length;
    }
  }

  private setIfPutItemsIntoAccordion(criteria: AssociatedDiseaseCategories): void {
    if (criteria && this.geneDiseaseCategoriesLength !== 0) {
      if (this.geneDiseaseCategoriesLength > this.maxItemsToShow) {
        // Avoid a case when there is only one item left inside an accordion.
        // In this case we show the whole list.
        this.isAccordion = this.geneDiseaseCategoriesLength - this.maxItemsToShow !== 1;
      } else {
        this.isAccordion = false;
      }
    }
  }

  public toggleAccordion(event: boolean): void {
    this.isAccordionOpen = event;
  }
}
