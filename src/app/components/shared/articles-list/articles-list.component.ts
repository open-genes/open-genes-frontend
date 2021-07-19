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
  public pageIndex = 1;
  public showMoreButtonVisible = false;
  public articlesTotal: number;

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

  public showMore(): void {
    if (this.articlesTotal / this.articlesList.length > this.pageIndex) {
      // before
      ++this.pageIndex;
      console.log(this.pageIndex);
      this.makeArticlesList();
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
            this.articlesTotal = data.articles.total;

            if (this.articlesList) {
              this.newArticlesLoaded.emit(true);

              // Check if there is more content to show
              if (
                this.articlesTotal / this.articlesList.length >
                this.pageIndex
              ) {
                // after
                this.showMoreButtonVisible = true;
              }
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
            // TODO: transfer the code above here when the real data becomes available
          },
          (error) => (this.error = error)
        );
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
