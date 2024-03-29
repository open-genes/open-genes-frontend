import { Component, Input, OnInit } from '@angular/core';
import { Gene } from '../../../core/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gene-reference',
  templateUrl: './gene-reference.component.html',
  styleUrls: ['./gene-reference.component.scss'],
})
export class GeneReferenceComponent implements OnInit {
  @Input() gene: Gene;
  public pubMedSearchLink: string;
  public geneListForNewsFeed: string[] = [];
  public showNewsListSkeleton = true;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    this.generatePubMedSearchLink(this.gene);
    this.generateListForPubmedArticlesList(this.gene);
  }

  private generateListForPubmedArticlesList(gene): void {
    const genes = [gene.symbol, ...gene.aliases];
    genes.forEach((gene) => {
      this.geneListForNewsFeed.push(gene);
    });
  }

  private generatePubMedSearchLink(gene: Gene): void {
    const url = `https://pubmed.ncbi.nlm.nih.gov/?term=(${gene.symbol}[Title/Abstract])`;
    const theme = '+AND+(aging[Title/Abstract])';
    let aliases = '';
    const filters = '&filter=datesearch.y_5';
    const synonyms: string[] = [];
    gene.aliases.forEach((alias) => {
      if (alias.length !== 0) {
        synonyms.push(`(${alias}[Title/Abstract])`);
      }
    });
    if (gene.aliases.length !== 0) {
      aliases = `+OR+${[...synonyms].join('+OR+')}`;
    }

    this.pubMedSearchLink = `${url}${theme}${aliases}${filters}`;
  }
}
