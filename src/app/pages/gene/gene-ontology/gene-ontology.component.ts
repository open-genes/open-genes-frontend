import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gene-ontology',
  templateUrl: './gene-ontology.component.html',
  styleUrls: ['./gene-ontology.component.scss'],
})
export class GeneOntologyComponent {
  @Input() public gene: any;
  @Input() public process: Map<string, string>;
  @Input() public component: Map<string, string>;
  @Input() public activity: Map<string, string>;
  public maxItemsToShow = 10;
  public biologicalProcessMaxItems: number = this.maxItemsToShow;
  public cellularComponentMaxItems: number = this.maxItemsToShow;
  public molecularActivityMaxItems: number = this.maxItemsToShow;

  constructor(public translate: TranslateService) {}
}
