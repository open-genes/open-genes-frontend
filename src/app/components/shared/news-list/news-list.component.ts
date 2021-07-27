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
import { PubmedApiService } from '../../../core/services/api/pubmed.api.service';
import { IPublication } from '../../../core/models/vendorsApi/pubMed/news.model';
import { Gene, Genes } from '../../../core/models';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsListComponent implements OnInit, OnDestroy {
  @Input() genesList: Genes[];
  @Input() showDates = false;
  @Input() loadTotal: number;
  @Input() itemsForPage: number;
  @Input() isShowMoreButton = true;

  @Output()
  newItemsLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isLoading = true;
  public error: number;
  public newsList: IPublication[] = [];
  public pageIndex = 1;
  public showMoreButtonVisible = false;
  public newsTotal: number;
  public responsePagePortion: number;

  private minGeneFunctionsCriteria = 3;
  private subscription$ = new Subject();
  private httpCallsCounter = 0;

  constructor(
    public translate: TranslateService,
    private pubmedApiService: PubmedApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.makeNewsList();
  }

  public showMore(): void {
    // console.log('showMore()');
    // console.log(
    //   this.newsTotal / this.responsePagePortion > this.pageIndex,
    //   `page ${this.pageIndex} of ${this.newsTotal / this.responsePagePortion}`
    // );

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
    const filteredGenes = this.genesList.filter(
      (gene: Genes) =>
        gene.functionalClusters.length > this.minGeneFunctionsCriteria
    );
    filteredGenes.forEach((gene: Gene) => {
      symbolsQuery.push(gene.symbol);
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
            this.httpCallsCounter === 1
              ? (this.responsePagePortion = this.newsList.length)
              : this.httpCallsCounter;

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
          this.isLoading = false;
          this.cdRef.markForCheck();
          console.log(this.pageIndex);
        },
        (error) => (this.error = error)
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
