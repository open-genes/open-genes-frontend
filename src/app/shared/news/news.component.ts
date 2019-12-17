import {Component, Input, OnInit} from '@angular/core';
import {PubmedApiService} from '../../core/services/pubmed.api.service';
import {INews} from '../../core/models/news.model';
import {IGene} from '../../core/models';
import {finalize, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  @Input() genes: IGene[];
  newsList: INews[];
  loading: boolean;

  constructor(private pubmedApiService: PubmedApiService) {
    this.newsList = [];
    this.loading = true;
  }

  ngOnInit() {
    this.getNews();
  }

  private getNews() {
    let symbolsQuery = '';
    const filteredGenes = this.genes.filter((gene: IGene) => gene.functionalClusters.length > 2 ? true : false);
    filteredGenes.forEach((gene: IGene, index: number, array: IGene[]) => {
      symbolsQuery += `${gene.symbol}[Title]`;
      symbolsQuery += index < array.length - 1 ? '+OR+' : '';
    });
    this.pubmedApiService.getNewsList(symbolsQuery).pipe(
      switchMap(news => {
        return this.pubmedApiService.getNewsData(
          news.esearchresult.idlist
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
        );
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(data => {
      data.result.uids.forEach(id => {
        filteredGenes.forEach((gene: IGene) => {
          if (data.result[id].title.toLowerCase().indexOf(gene.symbol.toLowerCase()) !== -1) {
            this.newsList.push({
              url: environment.pubmedUrl + id,
              title: data.result[id].title,
              gene
            });
          }
        });
      });
    });
  }
}
