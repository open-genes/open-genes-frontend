import { Component, Input, OnInit } from '@angular/core';
import { AssociatedDiseases } from '../../../core/models/API/associated-diseases.model';

@Component({
  selector: 'app-associated-diseases',
  templateUrl: './associated-diseases.component.html',
  styleUrls: ['./associated-diseases.component.scss']
})
export class AssociatedDiseasesComponent implements OnInit {
  @Input() geneDiseases: any;
  public mappedDiseases: string[] = [];
  public geneDiseasesLength: number = 0;
  public isAccordion: boolean = false;
  public maxItemsToShow: number = 1;
  public isAccordionOpen: boolean;

  constructor() { }

  ngOnInit(): void {
    this.mapDiseases();
    this.setDiseaseListLength(this.geneDiseases);
    this.setIfPutItemsIntoAccordion(this.geneDiseases);
  }

  private mapDiseases(): void {
    for (const [key, value] of Object.entries(this.geneDiseases)) {
      this.mappedDiseases.push(value['name']);
    }
  }

  private setDiseaseListLength(criteria: AssociatedDiseases): void {
    if (criteria) {
      this.geneDiseasesLength = Object.keys(criteria).length;
    }
  }

  private setIfPutItemsIntoAccordion(criteria: AssociatedDiseases): void {
    if (criteria && this.geneDiseasesLength !== 0) {
      if (this.geneDiseasesLength > this.maxItemsToShow) {
        // Avoid a case when there is only one item left inside an accordion.
        // In this case we show the whole list.
        this.isAccordion = this.geneDiseasesLength - this.maxItemsToShow !== 1;
      } else {
        this.isAccordion = false;
      }
    }
  }

  public toggleAccordion(event: boolean): void {
    this.isAccordionOpen = event;
  }
}
