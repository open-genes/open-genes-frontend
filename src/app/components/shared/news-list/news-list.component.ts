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
import { Publication } from '../../../core/models/vendors-api/publications-search-api/pubmed-feed.model';
import { Genes } from '../../../core/models';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { NewsListParams } from '../../../core/models/vendors-api/publications-search-api/pubmed-feed.model';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsListComponent implements OnDestroy {
  @Input() set genesList(genes: NewsListParams[]) {
    if (genes.length) {
      this.makeNewsList(genes);
    }
  }

  @Input() showDates = false;
  @Input() loadTotal: number;
  @Input() itemsForPage: number;
  @Input() isMiniMode = false;
  @Input() showSkeleton: boolean;

  @Output() skeletonState: EventEmitter<boolean> = new EventEmitter<boolean>();

  public error: number;
  public newsList: Publication[] = [];
  private pageIndex = 1;
  public showMoreButtonVisible = false;
  public newsTotal: number;

  private symbolsQuery = [];
  private minGeneFunctionsCriteria = 4;
  private responsePagePortion: number;
  private httpCallsCounter = 0;
  private genesListLimit = 250;
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private pubmedApiService: PubmedApiService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  public showMore(): void {
    if (this.newsTotal / this.responsePagePortion > this.pageIndex) {
      ++this.pageIndex;
      this.skeletonState.emit(true);
      this.cdRef.markForCheck();
      this.getNewsList();
    }
  }

  private makeNewsList(genes?): void {
    // 1. Form a request for all genes in the database that meet the minimal number of gene functions
    genes.forEach((gene: Genes) => {
      if (this.symbolsQuery.length <= this.genesListLimit) {
        if (gene.functionalClusters) {
          if (gene.functionalClusters.length > this.minGeneFunctionsCriteria) {
            this.symbolsQuery.push(gene.symbol);
          }
        } else {
          this.symbolsQuery.push(gene.symbol);
        }
      }
    });
    this.getNewsList();
  }

  private getNewsList(): void {
    this.httpCallsCounter++;
    // 2. Make a long query string for all genes at once, but ask to return only n news in the response
    this.pubmedApiService
      .getNewsList(this.symbolsQuery, this.loadTotal, this.pageIndex)
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (response) => {
          // Get data
          this.newsTotal = response.total;
          this.newsList.push(...response.items);

          if (this.newsList?.length !== 0) {
            // Set page length after checking the length of the 1st page
            this.httpCallsCounter === 1 ? (this.responsePagePortion = this.newsList.length) : this.httpCallsCounter;

            // Emit event to update view
            this.skeletonState.emit(false);

            // Check if there is more content to show
            // and show/hide 'Show more' button
            this.showMoreButtonVisible = this.newsTotal / this.responsePagePortion > this.pageIndex;
          }
        },
        (error) => {
          this.error = error;
          this.skeletonState.emit(false);
        },
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
