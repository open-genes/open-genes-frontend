import { Component, Input, OnInit } from '@angular/core';
import { Gene } from '../../../core/models';
import { TranslateService } from '@ngx-translate/core';
import { NewsListParams } from '../../../core/models/vendors-api/pubmed/publications-search-api.model';

@Component({
  selector: 'app-gene-reference',
  templateUrl: './gene-reference.component.html',
  styleUrls: ['./gene-reference.component.scss'],
})
export class GeneReferenceComponent implements OnInit {
  @Input() gene: Gene;
  public PubMedSearchLink: string;
  public geneListForNewsFeed: NewsListParams[] = [];

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    this.generatePubMedSearchLink(this.gene);
    this.generateListForPubmedArticlesList(this.gene);
  }

  private generateListForPubmedArticlesList(gene): void {
    const genes = [gene.symbol, ...gene.aliases];
    genes.forEach((gene) => {
      this.geneListForNewsFeed.push({
        symbol: gene,
        functionalClusters: null,
      });
    });
  }

  private generatePubMedSearchLink(gene: Gene): void {
    const url = `https://pubmed.ncbi.nlm.nih.gov/?term=(${gene.symbol}[Title/Abstract])+AND+(aging[Title/Abstract])`;
    const sinonyms = '';
    const filters = '&filter=datesearch.y_5';
  }
}
