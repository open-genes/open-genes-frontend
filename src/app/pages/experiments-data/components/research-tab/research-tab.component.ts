import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { AdditionalInterventionResolver } from 'src/app/core/utils/additional-intervention-resolver';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchMode } from '../../../../core/models/settings.model';
import { Genes } from '../../../../core/models';
import { StudiesFilterService } from '../../../../core/services/filters/studies-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResearchFilter } from '../../../../core/models/filters/filter.model';
import { RouterParamsDecorator } from '../../../../core/decorators/router-params.decorator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-research-tab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.scss'],
})
@RouterParamsDecorator()
export class ResearchTabComponent extends AdditionalInterventionResolver implements OnInit, OnDestroy {
  @Input() studyType: ResearchArguments;
  @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public itemsNumber: number;
  public resultingList: ResearchTypes[] = [];
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

  private cachedData: ResearchTypes[] = [];
  private querySubstrings: string[] = [];
  private subscription$ = new Subject();
  public genesList: Pick<Genes, 'id' | 'symbol' | 'name' | 'ensembl'>[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private filterService: StudiesFilterService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.setInitialState();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
    this.filterService.clearFilters();
  }

  public setInitialState(): void {
    this.getGenesListForHints();
    this.filterService.filterResult
      .pipe(
        takeUntil(this.subscription$),
        switchMap((filters: ApiResearchFilter) => {
          // isLoading
          this.studies = [];
          // this.currentPage = 1;
          this.error.isError = false;
          this.error.errorStatus = undefined;
          this.isNotFound = false;
          return this.filterService.getSortedAndFilteredStudies(this.studyType);
        })
      )
      .subscribe(
        (res: ApiResponse<ResearchTypes>) => {
          this.currentPage = this.filterService.pagination.page;

          if (this.currentPage == 1) {
            this.cachedData = [];
          }

          if (res.items?.length) {
            this.cachedData.push(...res.items);
            this.resultingList = [...this.cachedData];
          }

          // TODO: Why this statement?
          if (this.filterService.filters.byGeneSymbol || this.filterService.filters.byGeneSymbol) {
            // this.resetPagination();
            this.openSnackBar();
          }

          // this.downloadSearch(this.searchedData);
          this.isLoading = false;
          this.itemsNumber = res.options.objTotal;
          this.cdRef.markForCheck();
        },
        (error) => {
          console.warn(error);
          // this.isLoading = false;
          this.error.isError = false;
          this.error.errorStatus = undefined;
          this.cdRef.markForCheck();
        }
      );
  }

  public setResearchesList(query: Genes[] | string) {
    if (query) {
      if (query.length > 1) {
        const length = (query as string).split(',').length;
        if (length > 1) {
          this.filterService.clearFilters('byGeneSymbol');
          this.querySubstrings = (query as string)
            .split(',')
            .map((query) => query.trim())
            .filter((q) => q);
          this.filterService.filters.byGeneSymbol = this.querySubstrings;
        } else {
          this.querySubstrings = [];
          this.filterService.clearFilters('byGeneSymbol');
        }
        this.filterService.updateList(this.filterService.filters);
      } else {
        this.studies = [];
      }

      if (this.studies.length) {
        this.openSnackBar();
      }
    } else {
      this.querySubstrings = [];
    }
  }

  public setSearchQuery(query: string): void {
    this.filterService.clearFilters();
    this.searchByGenes(query);
  }

  public updateResearchesList(query): void {
    if (query && this.resultingList.length !== 0) {
      this.studies = [...this.resultingList];
    } else {
      this.studies = [];
    }
    this.isNotFound = this.resultingList.length === 0;
    this.openSnackBar();
  }

  private searchByGenes(query: string): void {
    if (query && query.length > 1) {
      this.query = query.toLocaleLowerCase().trim();
      this.filterService.applyFilter('byGeneSymbol', query);
      this.getExperiments(this.studyType);
    } else {
      this.resultingList = [];
    }
  }

  private openSnackBar(): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.studies ? this.studies.length : 0,
      },
      duration: 600,
    });
  }

  public getGenesListForHints(): void {
    this.apiService
      .getGenesV2()
      .pipe(takeUntil(this.subscription$))
      .subscribe((res) => {
        this.genesList = res.items.map((r) => {
          return { id: r.id, symbol: r.symbol, name: r.name, ensembl: r.ensembl };
        });
      });
  }

  public getExperiments(researchType: ResearchArguments, callback?: () => void): void {
    this.isLoading = true;
    this.cdRef.markForCheck();
    this.filterService.pagination.page = this.currentPage; // TODO: no public properties for filter class
    this.filterService
      .getSortedAndFilteredStudies(researchType)
      .pipe(
        takeUntil(this.subscription$),
        map((r: ApiResponse<ResearchTypes>) => {
          if (researchType === 'lifespan-change') {
            r.items = r.items.filter((r: any) => this.resolveAdditionalIntervention(r));
          }
          return r;
        })
      )
      .subscribe(
        (researches) => {
          this.studies = [...this.studies, ...researches.items] as any;
          this.options = researches.options;
          this.isLoading = false;
          this.cdRef.markForCheck();
        },
        (err) => {
          // TODO: error output
          this.error.isError = true;
          this.error.errorStatus = err.statusText;
          this.isLoading = false;
          this.cdRef.markForCheck();
        }
      );
    this.dataLoaded.emit(true);
    if (callback) {
      callback();
    }
  }

  public showMore(event: any, researchType: ResearchArguments): void {
    this.renderer.addClass(event.target, 'show-more__button--active');
    this.currentPage = this.currentPage + 1;
    this.getExperiments(researchType, () => {
      this.slice.next(this.studies.length);
      this.renderer.removeClass(event.target, 'show-more__button--active');
      this.cdRef.markForCheck();
    });
  }
}
