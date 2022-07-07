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
import { Research, ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { map, takeUntil } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { AdditionalInterventionResolver } from 'src/app/core/utils/additional-intervention-resolver';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchMode } from '../../../../core/models/settings.model';
import { Genes } from '../../../../core/models';
import { FilterService } from '../../../../components/shared/genes-list/services/filter.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-research-tab',
  templateUrl: './research-tab.component.html',
  styleUrls: ['./research-tab.component.scss'],
})
export class ResearchTabComponent extends AdditionalInterventionResolver implements OnInit, OnDestroy {
  @Input() researchType: ResearchArguments;
  @Output() dataLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public searchedGenesList: Research[] = [];
  public query: string;
  public searchMode: SearchMode = 'searchByGenes';
  public researches: ResearchTypes = [];
  public statResearches: ResearchTypes = []; // TODO: for static
  public options: PageOptions;
  public page = 1;
  public isNotFound = false;
  public isLoading = true;
  public slice = new BehaviorSubject(20);
  public error = {
    isError: false,
    errorStatus: '',
  };
  private arrayOfWords: string[] = [];
  private subscription$ = new Subject();
  public genesList: Pick<Genes, 'id' | 'symbol' | 'name' | 'ensembl'>[] = [];

  constructor(
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.getGenesListForHints();
    this.getResearches(this.researchType);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public setInitialState(): void {
    this.researches = [];
    this.page = 1;
    this.error.isError = false;
    this.error.errorStatus = undefined;
    this.getResearches(this.researchType);
  }

  public setResearchesList(query: Genes[] | string) {
    if (query) {
      if (query.length > 1) {
        const length = (query as string).split(',').length;
        if (length > 1) {
          delete this.filterService.filters.bySuggestions;
          this.arrayOfWords = (query as string)
            .split(',')
            .map((query) => query.trim())
            .filter((q) => q);
          this.filterService.filters.byGeneSymbol = this.arrayOfWords;
        } else {
          this.arrayOfWords = [];
          delete this.filterService.filters.byGeneSymbol;
          this.filterService.filters.bySuggestions = query as string;
        }
        this.filterService.updateList(this.filterService.filters);
      } else {
        this.researches = [];
      }

      if (this.researches.length) {
        this.openSnackBar();
      }
    } else {
      this.arrayOfWords = [];
    }
  }

  public setSearchQuery(query: string): void {
    this.searchByGenes(query);
  }

  public updateResearchesList(query): void {
    if (query && this.searchedGenesList.length) {
      this.researches = [...this.searchedGenesList];
      this.isNotFound = this.researches.length === 0;
      this.openSnackBar();
    }

    if (query && this.searchedGenesList.length === 0) {
      this.isNotFound = true;
      this.researches = [];
      this.openSnackBar();
    }
  }

  private searchByGenes(query: string): void {
    this.researches = this.statResearches;
    if (query && query.length > 1) {
      this.query = query.toLocaleLowerCase().trim();
      this.searchedGenesList = this.researches?.filter((research) => {
        // Fields always acquired in response
        const searchedText = `${research.geneId}${research.geneSymbol}${research.geneName}`.trim().toLocaleLowerCase();
        return searchedText.indexOf(this.query) > -1;
      });
    } else {
      this.searchedGenesList = [];
    }
  }

  private openSnackBar(): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {
        title: 'items_found',
        length: this.researches ? this.researches.length : 0,
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

  public getResearches(researchType: ResearchArguments, callback?: () => void): void {
    this.isLoading = true;
    this.cdRef.markForCheck();
    this.apiService
      .getResearches(researchType, this.page)
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
          this.researches = [...this.researches, ...researches.items] as any;
          this.statResearches = this.researches;
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
    this.page = this.page + 1;
    this.getResearches(researchType, () => {
      this.slice.next(this.researches.length);
      this.renderer.removeClass(event.target, 'show-more__button--active');
      this.cdRef.markForCheck();
    });
  }
}
