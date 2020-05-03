import {Component, Input, Output, OnInit, OnChanges} from '@angular/core';
import {PubmedApiService} from '../../core/services/pubmed.api.service';
import {News} from '../../core/models/news.model';
import {Genes} from '../../core/models';
import {finalize, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnChanges {
  @Input() genesList: Genes[];
  @Input() limit;
  newsList: News[];
  isLoading: boolean;
  error: number;

  constructor(
    public translate: TranslateService,
    private pubmedApiService: PubmedApiService
  ) {
    this.newsList = [];
    this.isLoading = true;
  }

  ngOnInit() {
    this.makeNewsList(this.limit);
  }

  ngOnChanges(changes) {
    if (changes && changes.limit && changes.limit.currentValue > changes.limit.previousValue) {
      this.makeNewsList(this.limit);
    }
  }

  private makeNewsList(limit) {
    let symbolsQuery = '';
    // Формируем запрос по всем генам в базе c n количеством функциональных классов
    const filteredGenes = this.genesList.filter((gene: Genes) => gene.functionalClusters.length > 3);
    filteredGenes.forEach((gene: Genes, index: number, array: Genes[]) => {
      symbolsQuery += `${gene.symbol}[Title]`;
      symbolsQuery += index < array.length - 1 ? '+OR+' : ''; // соединяем HGNC генов в запросе
    });
    // Делаем длинный запрос сразу по всем генам, но просим вернуть всего n статей в ответе
    this.pubmedApiService.getNewsList(symbolsQuery, limit).pipe(
      switchMap(news => {
        return this.pubmedApiService.getNewsData(
          news.esearchresult.idlist
          // Сортировать не надо, первыми API возвращает публикации от новых к старым
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
              date: data.result[id].pubdate,
              gene
            });
          }
        });
      });
    }, error => this.error = error);
  }
}
