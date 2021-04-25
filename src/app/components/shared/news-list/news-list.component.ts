import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { PubmedApiService } from "../../../core/services/api/pubmed.api.service";
import { News } from "../../../core/models/API/news.model";
import { Genes } from "../../../core/models";
import { finalize, switchMap, takeUntil } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-news-list",
  templateUrl: "./news-list.component.html",
  styleUrls: ["./news-list.component.scss"],
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
  private minGeneFunctionsCriteria: number = 3;
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
    let symbolsQuery = "";
    // 1. Form a request for all genes in the database that meet the minimal number of gene functions
    const filteredGenes = this.genesList.filter(
      (gene: Genes) => gene.functionalClusters.length > this.minGeneFunctionsCriteria
    );
    filteredGenes.forEach((gene: Genes, index: number, array: Genes[]) => {
      symbolsQuery += `${gene.symbol}[Title]`;
      symbolsQuery += index < array.length - 1 ? "+OR+" : ""; // concat genes' HGNC in the request
    });

    // 2. Make a long query string for all genes at once, but ask to return only n articles in the response
    this.pubmedApiService
      .getNewsList(symbolsQuery, limit)
      .pipe(
        switchMap((news) =>
          this.pubmedApiService.getNewsData(
            news.esearchresult.idlist
            // There is no need to sort publications. API returns a list of publications from new to old.
          )
        ),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (data) => {
          data.result.uids.forEach((id) => {
            filteredGenes.forEach((gene: Genes) => {
              if (
                data.result[id].title
                  .toLowerCase()
                  .indexOf(gene.symbol.toLowerCase()) !== -1
              ) {
                this.newsList.push({
                  url: `${environment.pubmedUrl}${id}`,
                  title: data.result[id].title,
                  date: data.result[id].pubdate,
                  gene,
                });
              }
            });
          });
          this.cdRef.markForCheck();
        },
        (error) => (this.error = error)
      );
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
