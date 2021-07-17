import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { I80levelResponseArticle } from '../../../core/models/vendorsApi/80level/80level.model';
import { takeUntil } from 'rxjs/operators';
import { EightyLevelService } from '../../../core/services/api/80level.api.service';
import { environment } from '../../../../environments/environment';
import { MockApiService } from '../../../core/services/api/mock.api.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articlesList: I80levelResponseArticle[];
  public environment = environment;
  public isLoading = true;
  public error: number;
  public defaultAvatar = '/assets/images/avatar.png';
  public defaultCover = '/assets/images/home-background.png'; // TODO: draw a default cover
  public isMocked = true;
  public pageIndex = 0;
  public showMoreButtonVisible = false;

  private subscription$ = new Subject();

  @Output()
  newArticlesLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public translate: TranslateService,
    private readonly eightyLevelService: EightyLevelService,
    private readonly mock: MockApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.makeArticlesList();
  }

  // TODO: Now I know articles quantity, this.pageIndex =< articles.total
  // rewrite using this
  public showMore() {
    try {
      ++this.pageIndex;
      console.log(this.pageIndex);
      if (this.articlesList) {
        this.makeArticlesList();
      } else {
        this.showMoreButtonVisible = false;
      }
    } catch (e) {
      this.showMoreButtonVisible = false;
    }
  }

  private makeArticlesList(): void {
    if (this.isMocked) {
      this.mock
        .getMockResponse({ page: this.pageIndex })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.articlesList = data.articles.items;
            console.log(this.articlesList);
            if (this.articlesList) {
              this.showMoreButtonVisible = true;
              this.newArticlesLoaded.emit(true);
            }

            this.isLoading = false;
            this.cdRef.markForCheck();
          },
          (error) => (this.error = error) // TODO: add loging
        );
    } else {
      this.eightyLevelService
        .getArticles({ page: this.pageIndex })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.articlesList = data.articles.items;
            // TODO: this.pageIndex =< articles.total
            this.isLoading = false;
            this.cdRef.markForCheck();
          },
          (error) => (this.error = error)
        );
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
