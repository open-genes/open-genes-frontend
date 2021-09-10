import { Component, Input, OnInit } from '@angular/core';
import { AssociatedDiseases } from '../../../core/models/openGenesApi/associated-diseases.model';
import { Base } from '../base';

@Component({
  selector: 'app-associated-diseases',
  templateUrl: './associated-diseases.component.html',
  styleUrls: ['./associated-diseases.component.scss'],
})
export class AssociatedDiseasesComponent extends Base implements OnInit {
  @Input() geneDiseases: AssociatedDiseases;

  public mappedDiseases: string[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.mapDiseases();
    this.setListLength(this.geneDiseases);
    this.putItemsIntoAccordion(this.geneDiseases);
  }

  private mapDiseases(): void {
    for (const [key, value] of Object.entries(this.geneDiseases)) {
      this.mappedDiseases.push(value['name']);
    }
  }
}
