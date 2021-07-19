import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { PubmedApiService } from '../../../core/services/api/pubmed.api.service';
import { News } from '../../../core/models/vendorsApi/pubMed/news.model';
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
  @Input() itemsForPage: number;
  @Input() loadTotal: number;
  public isLoading = true;
  public error: number;
  public newsList: News[] = [];

  private minGeneFunctionsCriteria = 3;
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private pubmedApiService: PubmedApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.makeNewsList(this.loadTotal);
  }

  private makeNewsList(limit: number): void {
    // 1. Form a request for all genes in the database that meet the minimal number of gene functions
    const symbolsQuery = [];
    const filteredGenes = this.genesList.filter(
      (gene: Genes) =>
        gene.functionalClusters.length > this.minGeneFunctionsCriteria
    );
    filteredGenes.forEach((gene: Gene) => {
      symbolsQuery.push(gene.symbol);
    });

    // TODO: optimize
    // 2. Make a long query string for all genes at once, but ask to return only n articles in the response
    this.pubmedApiService
      .getNewsList(symbolsQuery, limit)
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (response) => {
          this.newsList = response;
          this.cdRef.markForCheck();
          this.isLoading = false;
        },
        (error) => (this.error = error)
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
