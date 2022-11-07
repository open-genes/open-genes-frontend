import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, ViewChild,
} from '@angular/core';
import { ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { AdditionalInterventionResolver } from 'src/app/core/utils/additional-intervention-resolver';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SearchMode } from '../../../../core/models/settings.model';
import { Genes } from '../../../../core/models';
import { StudiesFilterService } from '../../../../core/services/filters/studies-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModalComponent } from '../../../../components/ui-components/components/modals/common-modal/common-modal.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-research-tab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.scss'],
})
export class ResearchTabComponent extends AdditionalInterventionResolver implements OnInit, OnDestroy {
  @Input() studyType: ResearchArguments;
  @Input() isMobile: BehaviorSubject<boolean>;
  @Output() dataLoaded: EventEmitter<never> = new EventEmitter<never>();
  @ViewChild('newPageMessageTemplate') newPageMessageTemplate: ElementRef;

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
    private dialog: MatDialog,
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

    this.isMobile.subscribe((r) => {
      if (!r) {
        this.dialog.closeAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.router$.unsubscribe();
    this.studies$.unsubscribe();
    this.slice.unsubscribe();
    this.filterService.clearFilters();
    this.snackBar = undefined;
  }

  public setInitialState(): void {
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
        .pipe(
          takeUntil(this.genes$)
        )
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
      this.currentPage = 1;
      this.filterService.clearFilters('byGeneSymbol');
      this.getStudies(this.studyType, () => {
        if (this.options && this.snackBar) {
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: {
              title: 'items_found',
              length: this.options.objTotal,
            },
            duration: 1200,
          });
        }
      });
    } else {
      this.studies = null;
    }
  }

  public resetPagination(): void {
    this.filterService.pagination.page = 1;
    this.currentPage = this.filterService.pagination.page;
    this.slice.next(20);
  }

  public getStudies(studyType: ResearchArguments, callback?: (res?: ApiResponse<ResearchTypes>) => void): void {
    this.isLoading = true;
    if (this.query) {
      this.filterService.applyFilter('byGeneSymbol', this.query);
    }

    this.filterService.filterChanges$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.studies$),
        switchMap((_) => {
          // Subscribing to any filters update and return getSortedAndFilteredStudies method to subscribe
          return this.filterService.getSortedAndFilteredStudies(this.studyType);
        }),
        map((r: ApiResponse<ResearchTypes>) => {
          if (studyType === 'lifespan-change') {
            r.items = r.items.filter((r: any) => this.resolveAdditionalIntervention(r));
          }
          return r;
        },
      ))
      .subscribe(
        (res) => {
          if (res.items?.length) {
            this.studies = res.items;
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

  public pageEventHandler(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.filterService.pagination.page = this.currentPage;
    this.filterService.onLoadNextPage(this.options?.pagination?.pagesTotal);
    this.slice.next(this.studies.length + this.itemsPerPage);
    this.cdRef.detectChanges();
    this.getStudies(this.studyType);
    this.snackBar.open(this.newPageMessageTemplate.nativeElement.textContent, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 600,
    });
  }

  /**
   * Opening modal for filters and fields settings
   */
  public openFiltersModal(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'filters-modal',
      minWidth: '320px',
      maxWidth: '768px',
      autoFocus: false,
    });
  }
}
