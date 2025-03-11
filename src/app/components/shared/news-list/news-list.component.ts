import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { PubmedApiService } from '../../../core/services/api/pubmed-api.service';
import {
  Publication,
  PublicationsList,
} from '../../../core/models/vendors-api/publications-search-api/pubmed-feed.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { IconComponent } from '../../ui-components/icon/app-icon.component';
import { NgForOf, NgIf } from '@angular/common';
import { NoContentComponent } from '../no-content/no-content.component';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  standalone: true,
  imports: [TranslateModule, PipesModule, RouterModule, IconComponent, NgForOf, NgIf, NoContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsListComponent implements OnInit, OnDestroy {
  @Input() genesList: string[] = [];

  @Input() showDates = false;
  @Input() loadTotal: number;
  @Input() itemsForPage: number;
  @Input() isMiniMode = false;

  @Input() showSkeleton: boolean;
  @Output() showSkeletonChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public error: number;
  public newsList: Publication[] = [];
  private pageIndex = 1;
  public showMoreButtonVisible = false;
  public newsTotal: number;

  private responsePagePortion: number;
  private httpCallsCounter = 0;
  private subscription$ = new Subject();

  constructor(
    private pubmedApiService: PubmedApiService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly router: Router,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/') {
      if (this.sessionStorageService.getStorageValue('news')) {
        const storageData = this.sessionStorageService.getStorageValue('news');
        this.newsList = storageData.news;
        this.newsTotal = storageData.total;
        this.showSkeletonChange.emit(false);
      } else {
        this.getNewsList();
      }
    } else {
      this.getNewsList();
    }
  }

  public showMore(): void {
    if (this.newsTotal / this.responsePagePortion > this.pageIndex) {
      ++this.pageIndex;
      this.showSkeletonChange.emit(true);
      this.getNewsList();
    }
  }

  private getNewsList(): void {
    this.httpCallsCounter++;
    // 2. Make a long query string for all genes at once, but ask to return only n news in the response
    this.pubmedApiService
      .getNewsList(this.genesList, this.loadTotal, this.pageIndex)
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (response: PublicationsList) => {
          // Get data
          this.newsList.push(...response.items);
          this.newsTotal = response.total;

          if (this.router.url === '/') {
            this.sessionStorageService.setStorage('news', { news: this.newsList, total: this.newsTotal });
          }

          if (this.newsList?.length !== 0) {
            // Set page length after checking the length of the 1st page
            this.httpCallsCounter === 1 ? (this.responsePagePortion = this.newsList.length) : this.httpCallsCounter;

            // Emit event to update view
            this.showSkeletonChange.emit(false);

            // Check if there is more content to show
            // and show/hide 'Show more' button
            this.showMoreButtonVisible = this.newsTotal / this.responsePagePortion > this.pageIndex;
          }

          this.cdRef.markForCheck();
        },
        (error) => {
          this.error = error;
          this.showSkeletonChange.emit(false);
          this.cdRef.markForCheck();
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
