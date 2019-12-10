import {Component, Input, OnInit} from '@angular/core';
import {PubmedApiService} from '../../core/services/pubmed.api.service';
import {INews} from '../../core/models/news.model';
import {IGene} from '../../core/models';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  @Input() gene: IGene;
  newsList: INews[] = [];

  constructor(private pubmedApiService: PubmedApiService) {
  }

  ngOnInit() {
    this.getNews();
  }

  private getNews() {
    this.pubmedApiService.getNewsList(this.gene.symbol).pipe(
      switchMap(news => {
        return this.pubmedApiService.getNewsData(news.esearchresult.idlist);
      })
    ).subscribe(data => {
      data.result.uids.forEach(id => {
        this.newsList.push({
          url: environment.pubmedUrl + id,
          title: data.result[id].title
        });
      });
    });
  }
}
