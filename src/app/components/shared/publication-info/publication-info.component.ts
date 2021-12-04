import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { PubmedApiService } from '../../../core/services/api/pubmed-api.service';
import { Subject } from 'rxjs';
import { ArticleData } from '../../../core/models/vendors-api/publications-search-api/article-data.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-publication-info',
  templateUrl: './publication-info.component.html',
  styleUrls: ['./publication-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PublicationInfoComponent implements OnInit, OnDestroy {
  @Input() doi: string;

  public articleInfo: ArticleData;
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private pubmedApiService: PubmedApiService) {}

  ngOnInit(): void {
    this.getArticleData(this.doi);
  }

  public getArticleData(doi): void {
    console.log(doi);
    this.pubmedApiService
      .getArticleByDoi(doi)
      .pipe(
        map((res) => {
          const articleInfo: ArticleData = {
            title: res.bibliographic_data.artifact_title,
            publisher: res.bibliographic_data.publisher,
            publicationYear: res.bibliographic_data.publication_year,
            citation: res.sort_count.citation.total,
          };
          return articleInfo;
        }),
        takeUntil(this.subscription$)
      )
      .subscribe(
        (res) => {
          this.articleInfo = res;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }
}
