import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Research, ResearchArguments, ResearchTypes } from '../../../../core/models/open-genes-api/researches.model';
import { map, takeUntil } from 'rxjs/operators';
import { ApiResponse, PageOptions } from '../../../../core/models/api-response.model';
import { Observable, of, Subject } from 'rxjs';
import { ApiService } from '../../../../core/services/api/open-genes-api.service';
import { AdditionalInterventionResolver } from 'src/app/core/utils/additional-intervention-resolver';
import { SnackBarComponent } from '../../../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchMode } from '../../../../core/models/settings.model';
import { Genes } from '../../../../core/models';
import { FilterService } from '../../../../components/shared/genes-list/services/filter.service';

@Component({
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
  public options: PageOptions;
  public page = 1;
  public isLoading = false;
  public slice: Observable<number>;
  public errorStatus: string;

  private arrayOfWords: string[] = [];
  private subscription$ = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.getResearches(this.researchType);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public setGenesList(query: Genes[] | string) {
    if (query) {
      if (query.length > 2) {
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
      this.clearFilters();
    }
  }

  public setSearchQuery(query: string): void {
    this.searchByGenes(query);
  }

  public updateGenesList(query): void {
    if (query && this.searchedGenesList.length) {
      this.researches = [...this.searchedGenesList];
      this.openSnackBar();
    }

    if (query && this.searchedGenesList.length === 0) {
      this.researches = [];
      this.openSnackBar();
    }
  }

  private searchByGenes(query: string): void {
    if (query && query.length > 2) {
      this.query = query;
      this.searchedGenesList = this.researches?.filter((research) => {
        // Fields always acquired in response
        const searchedText = [research.geneId, research.geneSymbol, research.geneName].join(' ').toLowerCase();
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
        length: this.researches ? this.researches.length : 0,
      },
      duration: 600,
    });
  }

  public getResearches(researchType: ResearchArguments): void {
    console.log('getResearches');
    this.isLoading = true;
    if (!this.slice) {
      this.slice = of(20);
    }
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
          this.options = researches.options;
          this.dataLoaded.emit(true);
        },
        (err) => {
          // TODO: error output
          this.errorStatus = err.statusText;
        }
      );
    this.isLoading = false;
  }

  public showMore(event: any, researchType: ResearchArguments): void {
    this.renderer.addClass(event.target, 'show-more__button--active');
    this.page = this.page + 1;
    this.getResearches(researchType);
    this.slice = of(this.researches.length);
    this.renderer.removeClass(event.target, 'show-more__button--active');
  }

  public clearFilters(filterName?: string): void {
    delete this.filterService.filters.bySuggestions;
    delete this.filterService.filters.byGeneSymbol;
    this.filterService.clearFilters(filterName ? filterName : null);
  }
}
