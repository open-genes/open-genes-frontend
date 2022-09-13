import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { AdditionalInterventionResolver } from 'src/app/core/utils/additional-intervention-resolver';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchMode } from '../../../../core/models/settings.model';
import { Genes } from '../../../../core/models';
import { StudiesFilterService } from '../../../../core/services/filters/studies-filter.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-research-tab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.scss'],
})
export class ResearchTabComponent extends AdditionalInterventionResolver implements OnInit, OnDestroy {
  @Input() studyType: ResearchArguments;
  @Output() dataLoaded: EventEmitter<never> = new EventEmitter<never>();

  public query: string;
  public searchMode: SearchMode = 'searchByGenes';
  public studies: ResearchTypes[] = [];
  public options: PageOptions;
  public isNotFound = false;
  public currentPage = 1;
  public isLoading = true;
  public slice = new BehaviorSubject(20);
  public error = {
    isError: false,
    errorStatus: '',
  };
  public genesList: Pick<Genes, 'id' | 'symbol' | 'name' | 'ensembl'>[] = [];
  public showProgressBar: boolean;

  private cachedData: ResearchTypes[] = [];
  private router$ = new Subject();
  private genes$ = new Subject();
  private studies$ = new ReplaySubject(1);
  private itemsPerPage = 20;

  constructor(
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private filterService: StudiesFilterService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute?.queryParams
      .pipe(takeUntil(this.router$))
      .subscribe((params) => {
      if (Object.keys(params).length) {
        for (const key in params) {
          if (params[key] !== this.filterService.filters[key].toString()) {
            if (key === 'byGeneSymbol') {
              this.query = params[key];
              this.showProgressBar = false;
              this.cdRef.markForCheck();
            }
            this.filterService.applyFilter(key, params[key]);
          }
        }
      }
    });
    this.setInitialState();
    this.cachedData = this.studies;
  }

  ngOnDestroy(): void {
    this.router$.unsubscribe();
    this.studies$.unsubscribe();
    this.slice.unsubscribe();
    this.filterService.clearFilters();
    this.snackBar = undefined;
  }

  private setInitialState(): void {
    this.query = null;
    this.cachedData = [];
    this.studies = [];
    this.resetPagination();
    this.isNotFound = false;
    this.error.isError = false;
    this.error.errorStatus = undefined;
    this.filterService.clearFilters();
    this.getStudies(this.studyType);
  }

  public setSearchQuery(query: string): void {
    if (query && query.length > 1) {
      this.query = query.toLocaleLowerCase().trim();
      this.searchGenes(query);
    }
  }

  private searchGenes(query: string): void {
    if (query && query.length > 1) {
      this.showProgressBar = true;
      this.apiService
        .getGenesMatchByString(query, this.query.length > 1 ? 'input' : undefined)
        .pipe(takeUntil(this.genes$))
        .subscribe(
          (searchData) => {
            this.genesList = searchData.items; // If nothing found, will return empty array
            this.showProgressBar = false;
          },
          (error) => {
            console.warn(error);
            this.showProgressBar = false;
          }
        );
    } else {
      this.genesList = [];
    }
  }

  public updateStudiesList(isSubmit?: boolean): void {
    if (isSubmit) {
      this.filterService.clearFilters('byGeneSymbol');
      this.getStudies(this.studyType, (res) => this.openSnackBar(res));
    } else {
      this.studies = null;
    }
  }

  public resetPagination(): void {
    this.filterService.pagination.page = 1;
    this.currentPage = this.filterService.pagination.page;
    this.slice.next(20);
  }

  private openSnackBar(res: ApiResponse<any>): void {
    if (res?.options && this.snackBar) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          title: 'items_found',
          length: res.options.objTotal,
        },
        duration: 1200,
      });
    }
  }

  public getStudies(researchType: ResearchArguments, callback?: (res?: ApiResponse<ResearchTypes>) => void): void {
    this.isLoading = true;
    if (this.currentPage === 1) {
      this.studies = [];
      this.filterService.clearFilters('byGeneSymbol');
    }
    if (this.query) {
      this.filterService.applyFilter('byGeneSymbol', this.query);
    }

    this.filterService.filterResult
      .pipe(
        takeUntil(this.studies$),
        switchMap(() => {
          // Subscribing to any filters update and return getSortedAndFilteredStudies method to subscribe
          return this.filterService.getSortedAndFilteredStudies(this.studyType);
        }),
        tap((r) => map((r: ApiResponse<ResearchTypes>) => {
          if (researchType === 'lifespan-change') {
            r.items = r.items.filter((s: any) => this.resolveAdditionalIntervention(s));
          }
          return r;
        })),
        shareReplay()
      )
      .subscribe(
        (res) => {

          if (this.currentPage === 1) {
            this.cachedData = [];
          }

          if (res.items?.length) {
            this.cachedData.push(...res.items);
            this.studies = [...this.cachedData];
          }
          this.options = res.options;
          this.isLoading = false;
          this.isNotFound = res.items?.length === 0;
          this.cdRef.markForCheck();
          if (callback) {
            callback(res);
          }
        },
        (err) => {
          this.error.isError = true;
          this.error.errorStatus = err.statusText;
          this.isLoading = false;
          this.cdRef.markForCheck();
        }
      );
    this.dataLoaded.emit();
  }

  public showMore(researchType: ResearchArguments): void {
    this.currentPage++;
    this.filterService.pagination.page = this.currentPage;
    this.filterService.onLoadMoreGenes(this.options?.pagination?.pagesTotal);
    this.slice.next(this.studies.length + this.itemsPerPage);
    this.cdRef.detectChanges();
  }

  public cancelSearch() {
    this.filterService.clearFilters();
    this.setInitialState();
  }
}
