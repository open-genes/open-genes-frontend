import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Pagination, SearchMode } from '../../core/models/settings.model';
import { Diet } from '../../core/models/open-genes-api/diet.model';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-diet-page',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DietComponent implements OnInit, OnDestroy {
  public genes: Diet[];
  public searchedGenesList: Diet[] = [];
  public confirmedGenesList: Diet[];
  public totalGenesLength: number;
  public isLoading = false;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGenes';

  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  private unsubscribe$ = new Subject();

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  public setSearchQuery(query: string): void {
    this.searchByGenes(query);
  }

  public updateGenesList(query): void {
    if (query && this.searchedGenesList.length) {
      this.confirmedGenesList = [...this.searchedGenesList];
      this.openSnackBar();
    }

    if (query && this.searchedGenesList.length === 0) {
      this.confirmedGenesList = [];
      this.openSnackBar();
    }

    if (!query && this.searchedGenesList.length === 0) {
      this.pagination.page = 1;
      this.pagination.pageSize = 20;
      this.onPaginationChange(this.pagination);
    }
  }

  private initData(): void {
    forkJoin([this.apiService.getGenesForDiet(), this.apiService.getGenesForDiet(this.pagination)])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.genes = res[0].items;
          this.confirmedGenesList = res[1].items;
          this.totalGenesLength = res[1].options.objTotal;
          this.cdRef.markForCheck();
        },
        (error) => {
          this.errorStatus = error.statusText;
          this.cdRef.markForCheck();
        }
      );
  }

  public onPaginationChange(event: Pagination): void {
    this.isLoading = true;
    this.apiService
      .getGenesForDiet(event)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.confirmedGenesList = res.items;
          this.totalGenesLength = res.options.objTotal;
          this.isLoading = false;
          this.cdRef.markForCheck();
        },
        (error) => {
          this.isLoading = false;
          this.cdRef.markForCheck();
        }
      );
  }

  private searchByGenes(query: string): void {
    if (query && query.length > 1) {
      this.searchedGenesList = this.genes?.filter((gene) => {
        // Fields always acquired in response
        const searchedText = [gene.id, gene?.ensembl ? gene.ensembl : '', gene.symbol, gene.name]
          .join(' ')
          .toLowerCase();
        return searchedText.includes(query);
      });
    } else {
      this.searchedGenesList = [];
    }
  }

  private openSnackBar(): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.confirmedGenesList ? this.confirmedGenesList.length : 0,
      },
      duration: 600,
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
