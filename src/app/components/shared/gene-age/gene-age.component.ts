import { Component, Input, OnInit } from '@angular/core';
import { Genes } from '../../../core/models';
import { GenePhylaClass } from './gene-phyla.class';
import { Phylum } from './phylum.model';
import { ShowOptionsEnum } from './show-options.enum';

@Component({
  selector: 'app-gene-age',
  templateUrl: './gene-age.component.html',
  styleUrls: ['./gene-age.component.scss'],
})
export class GeneAgeComponent extends GenePhylaClass implements OnInit {
  public phylumFamilyOrigin: Phylum;
  public phylumOrigin: Phylum;
  public phylumHomolog: Phylum;
  public isShowOnlyOrigin = false;
  public isShowOnlyHomologs = false;
  @Input() gene: Genes;
  @Input() show: ShowOptionsEnum;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.phylumFamilyOrigin = this.getPhylumDataByID(this.gene.familyOrigin?.id);
    this.phylumOrigin = this.getPhylumDataByID(this.gene.origin?.id);
    this.phylumHomolog = this.getPhylumDataByName(this.gene.homologueTaxon);
    this.isShowOnlyOrigin = this.show === ShowOptionsEnum['origin'];
    this.isShowOnlyHomologs = this.show === ShowOptionsEnum['homologs'];
  }
}
