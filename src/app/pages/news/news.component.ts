import { Component, OnInit, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Genes } from "../../core/models";
import { ApiService } from "../../core/services/api/open-genes.api.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
})
export class NewsComponent implements OnInit, OnDestroy {
  genes: Genes[];
  portion: number;
  private ngUnsubscribe = new Subject();

  constructor(
    private readonly apiService: ApiService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.portion = 10;
    this.getGenes();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public loadMore(portion: number): number {
    if (portion) {
      return (this.portion += portion);
    }
  }

  private getGenes() {
    this.apiService
      .getGenes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((genes) => {
        this.genes = genes;
      });
  }
}
