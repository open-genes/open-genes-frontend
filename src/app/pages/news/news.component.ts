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
import { Genes } from '../../core/models';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EightyLevelService } from '../../core/services/api/80level-api-service/80level-api.service';
import { environment } from '../../../environments/environment';
import { NewsListParams } from '../../core/models/vendors-api/publications-search-api/pubmed-feed.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {
  public genes: Genes[];
  public environment = environment;
  public geneListForNewsFeed: NewsListParams[] = [];
  private ngUnsubscribe = new Subject();

  @Output() loadMoreNewsEvent: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private readonly apiService: ApiService,
    private readonly eightyLevelService: EightyLevelService,
    public translate: TranslateService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getGenes();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public updateView(): void {
    this.cdRef.markForCheck();
  }

  private getGenes() {
    this.apiService
      .getGenes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((genes) => {
        this.genes = genes;
        genes.forEach((gene) => {
          this.geneListForNewsFeed.push({
            symbol: gene.symbol,
            functionalClusters: gene.functionalClusters,
          });
        });
        this.cdRef.markForCheck();
      });
  }
}
