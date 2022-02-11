import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Genes } from '../../core/models';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EightyLevelService } from '../../core/services/api/80level-api-service/80level-api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {
  public genes: Genes[];
  public geneListForNewsFeed: string[] = [];
  public showCardSkeleton = true;
  public showRowSkeleton = true;

  private ngUnsubscribe = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly apiService: ApiService,
    private readonly eightyLevelService: EightyLevelService,
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
      .getGenesV2()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((filteredGenes) => {
        this.genes = filteredGenes.items;
        this.geneListForNewsFeed = filteredGenes.items.map((gene) => {
          return gene.symbol;
        });
        this.cdRef.markForCheck();
      });
  }
}
