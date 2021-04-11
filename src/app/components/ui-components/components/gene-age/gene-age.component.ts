import { Component, Input, OnInit } from '@angular/core';
import { Gene } from '../../../../core/models';
import { GenePhylaClass } from './gene-phyla.class';
import { Phylum } from '../../../../core/models/phylum.model';

@Component({
  selector: 'app-gene-age',
  templateUrl: './gene-age.component.html',
  styleUrls: ['./gene-age.component.scss']
})
export class GeneAgeComponent extends GenePhylaClass implements OnInit {
  public phylumOrigin: Phylum;
  public phylumHomolog: Phylum;
  @Input() gene: Gene;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.phylumOrigin = this.getPhylumDataByID(this.gene.origin.id);
    this.phylumHomolog = this.getPhylumDataByName(this.gene.homologueTaxon);
  }
}
