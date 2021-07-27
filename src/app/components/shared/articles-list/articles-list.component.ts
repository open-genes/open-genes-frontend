import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
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
  public articlesList: I80levelResponseArticle[] = [];
  public environment = environment;
  public isLoading = true;
  public error: number;
  public defaultAvatar = '/assets/images/avatar.png';
  public defaultCover = '/assets/images/default-article-cover.jpg';
  public isMocked = false;
  public pageIndex = 1;
  public showMoreButtonVisible = false;
  public articlesTotal: number;
  public responsePagePortion: number;

  private subscription$ = new Subject();
  private httpCallsCounter = 0;

  @Input() isMiniMode = false;
  @Input() sliceTo: number | undefined = undefined;
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
    if (this.articlesTotal / this.responsePagePortion > this.pageIndex) {
      ++this.pageIndex;
      this.isLoading = true;
      this.cdRef.markForCheck();
      this.makeArticlesList();
    }
  }

  private handleResponse(data): void {
    this.articlesList.push(...data.articles.items);
    this.articlesTotal = data.articles.total;

    if (this.articlesList?.length !== 0) {
      // Set page length after checking the length of the 1st page
      this.httpCallsCounter++;
      if (this.httpCallsCounter === 1) {
        this.responsePagePortion = this.articlesList.length;
      }

      // Emit event to update view
      this.newArticlesLoaded.emit(true);

      // Check if there is more content to show
      // and show/hide 'Show more' button
      if (this.articlesTotal / this.responsePagePortion > this.pageIndex) {
        this.showMoreButtonVisible = true;
      } else {
        this.showMoreButtonVisible = false;
      }
    }
    console.log(this.articlesTotal, this.responsePagePortion, this.pageIndex);

    // All content is loaded
    this.isLoading = false;
    this.cdRef.markForCheck();
  }

  private makeArticlesList(): void {
    if (this.isMocked) {
      this.mock
        .getMockResponse({ page: this.pageIndex })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.handleResponse(data);
          },
          (error) => (this.error = error) // TODO: add loging
        );
    } else {
      this.eightyLevelService
        .getArticles({ page: this.pageIndex })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.handleResponse(data);
          },
          (error) => (this.error = error)
        );
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
