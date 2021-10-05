import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssociatedDiseases } from '../../../core/models/openGenesApi/associated-diseases.model';
import { WrapIntoAccordion } from '../../ui-components/components/accordion/wrapIntoAccordion';

@Component({
  selector: 'app-associated-diseases',
  templateUrl: './associated-diseases.component.html',
  styleUrls: ['./associated-diseases.component.scss'],
})
export class AssociatedDiseasesComponent extends WrapIntoAccordion implements OnInit {
  @Input() geneDiseases: AssociatedDiseases;
  @Input() activeListItem: string;
  @Output() clickEvent: EventEmitter<string> = new EventEmitter();

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

  public emitOnClick(diseaseName: any): void {
    this.clickEvent.emit(diseaseName);
  }
}
