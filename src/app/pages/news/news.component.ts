import {Component, EventEmitter, OnInit, OnDestroy, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Genes} from '../../core/models';
import {ApiService} from '../../core/services/api/open-genes.api.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit, OnDestroy {
  genes: Genes[];
  error: number;
  portion: number;
  private ngUnsubscribe = new Subject();

  constructor(
    private readonly apiService: ApiService,
    public translate: TranslateService) {
  }

  ngOnInit() {
    this.portion = 10;
    this.getGenes();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getGenes() {
    this.apiService.getGenes().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((genes) => {
      this.genes = genes;
    }, error => this.error = error);
  }

  public loadMore(portion: number) {
    if (portion) {
      return this.portion += portion;
    }
  }
}
