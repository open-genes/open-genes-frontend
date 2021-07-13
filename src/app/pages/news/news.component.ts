import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Genes } from '../../core/models';
import { ApiService } from '../../core/services/api/open-genes.api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EightyLevelService } from '../../core/services/api/80level.api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {
  public genes: Genes[];
  public itemsOnPage = 20;
  public itemsTotalLimit = 100;
  private ngUnsubscribe = new Subject();

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

  public loadMore(): void {
    if (this.itemsTotalLimit >= this.itemsOnPage) {
      this.itemsOnPage += this.itemsOnPage;
      this.cdRef.markForCheck();
    }
  }

  private getGenes() {
    this.apiService
      .getGenes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((genes) => {
        this.genes = genes;
        this.cdRef.markForCheck();
      });
  }
}
