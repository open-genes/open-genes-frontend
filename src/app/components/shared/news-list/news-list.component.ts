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
export class NewsListComponent implements OnInit, OnDestroy {
  @Input() genesList: NewsListParams[];
  @Input() showDates = false;
  @Input() loadTotal: number;
  @Input() itemsForPage: number;
  @Input() isMiniMode = false;

  @Output()
  newItemsLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isLoading = true;
  public error: number;
  public newsList: Publication[] = [];
  public pageIndex = 1;
  public showMoreButtonVisible = false;
  public newsTotal: number;
  public responsePagePortion: number;

  private minGeneFunctionsCriteria = 4;
  private subscription$ = new Subject();
  private httpCallsCounter = 0;
  private genesListLimit = 250;

  constructor(
    public translate: TranslateService,
    private pubmedApiService: PubmedApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.makeNewsList();
  }

  public showMore(): void {
    if (this.newsTotal / this.responsePagePortion > this.pageIndex) {
      ++this.pageIndex;
      this.isLoading = true;
      this.cdRef.markForCheck();
      this.makeNewsList();
    }
  }

  private makeNewsList(): void {
    this.httpCallsCounter++;

    // 1. Form a request for all genes in the database that meet the minimal number of gene functions
    const symbolsQuery = [];

    this.genesList.forEach((gene: Genes) => {
      if (symbolsQuery.length <= this.genesListLimit) {
        if (gene.functionalClusters) {
          if (gene.functionalClusters.length > this.minGeneFunctionsCriteria) {
            symbolsQuery.push(gene.symbol);
          }
        } else {
          symbolsQuery.push(gene.symbol);
        }
      }
    });

    // 2. Make a long query string for all genes at once, but ask to return only n news in the response
    this.pubmedApiService
      .getNewsList(symbolsQuery, this.loadTotal, this.pageIndex)
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
            this.newItemsLoaded.emit(true);

            // Check if there is more content to show
            // and show/hide 'Show more' button
            if (this.newsTotal / this.responsePagePortion > this.pageIndex) {
              this.showMoreButtonVisible = true;
            } else {
              this.showMoreButtonVisible = false;
            }
          }

          // All content is loaded
          this.stopLoader();
        },
        (error) => {
          this.error = error;
          this.stopLoader();
        }
      );
  }

  stopLoader(): void {
    this.isLoading = false;
    this.cdRef.markForCheck();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
