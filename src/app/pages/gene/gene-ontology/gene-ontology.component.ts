import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gene-ontology',
  templateUrl: './gene-ontology.component.html'
})

export class GeneOntologyComponent implements OnInit {
  @Input() public gene: any;
  @Input() public process: Map<string, string>;
  @Input() public component: Map<string, string>;
  @Input() public activity: Map<string, string>;

  constructor(public translate: TranslateService) { }

  ngOnInit() {

  }
}
