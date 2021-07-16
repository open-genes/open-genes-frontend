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
import { PageEvent } from '@angular/material/paginator';

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

  public length = 1;
  public pageSize = 10;
  public pageIndex = 0;
  public pageSizeOptions = [5, 10, 25];
  public showFirstLastButtons = false;

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

  public handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.makeArticlesList();
  }

  private makeArticlesList(): void {
    if (this.isMocked) {
      this.mock
        .getMockResponse({ page: this.pageIndex })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.articlesList = data.articles.items;
            this.isLoading = false;
            this.cdRef.markForCheck();
            this.newArticlesLoaded.emit(true);
          },
          (error) => (this.error = error)
        );
    } else {
      this.eightyLevelService
        .getArticles({ page: this.pageIndex })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.articlesList = data.articles.items;
            // TODO: calculate pages quantity?
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
