import {Component, Input, OnInit} from '@angular/core';
import {PubmedApiService} from '../../core/services/pubmed.api.service';
import {News} from '../../core/models/news.model';
import {Genes} from '../../core/models';
import {finalize, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  @Input() genesList: Genes[];
  @Input() limit: number;
  newsList: News[];
  isLoading: boolean;
  error: number;

  constructor(private pubmedApiService: PubmedApiService) {
    this.newsList = [];
    this.isLoading = true;
  }

  ngOnInit() {
    this.getNewsList(this.limit);
  }

  private getNewsList(limit) {
    let symbolsQuery = '';
    const filteredGenes = this.genesList.filter((gene: Genes) => gene.functionalClusters.length > 2);
    filteredGenes.forEach((gene: Genes, index: number, array: Genes[]) => {
      symbolsQuery += `${gene.symbol}[Title]`;
      symbolsQuery += index < array.length - 1 ? '+OR+' : '';
    });
    this.pubmedApiService.getNewsList(symbolsQuery, limit).pipe(
      switchMap(news => {
        return this.pubmedApiService.getNewsData(
          news.esearchresult.idlist
            // .sort(() => Math.random() - 0.5)
            .slice(0, limit)
        );
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(data => {
      data.result.uids.forEach(id => {
        filteredGenes.forEach((gene: Genes) => {
          if (data.result[id].title.toLowerCase().indexOf(gene.symbol.toLowerCase()) !== -1) {
            this.newsList.push({
              url: environment.pubmedUrl + id,
              title: data.result[id].title,
              gene
            });
          }
        });
      });
    }, error => this.error = error);
  }
}
