import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeneFiltersPanelComponent } from './components/gene-filters-panel/gene-filters-panel.component';
import { Genes } from '../../core/models';
import { SearchMode, SearchModeEnum } from '../../core/models/settings.model';
import { WindowService } from '../../core/services/browser/window.service';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { takeUntil } from 'rxjs/operators';
import { WindowWidth } from '../../core/utils/window-width';
import { Subject } from 'rxjs';
import { appliedFilter } from '../../components/shared/genes-list/genes-list-settings.model';
import { CommonModalComponent } from '../../components/ui-components/modals/common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { WordpressApiService } from '../../core/services/api/wordpress-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genes-search-page',
  templateUrl: './genes-search-page.component.html',
  styleUrls: ['./genes-search-page.component.scss'],
})
export class GenesSearchPageComponent extends WindowWidth implements OnInit, OnDestroy {
  @ViewChild(GeneFiltersPanelComponent) filterPanel!: GeneFiltersPanelComponent;

  public geneHints: Pick<Genes, 'id' | 'name' | 'symbol' | 'aliases' | 'ensembl'>[] | Genes[] = [];
  public queryFromRoute;
  public confirmedQuery: string;
  public searchedQuery: string;
  public itemsQuantity: number;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGenes';
  public searchModeEnum = SearchModeEnum;
  public genesListIsLoading = true;
  public showLatestGenesSkeleton = true;
  public showArticlesSkeleton = true;
  public showPubmedFeedSkeleton = true;
  public showFiltersSkeleton = true;
  public showProgressBar = false;
  public queryLength: number;
  public placeholder: string;
  public $cancelSearch: Subject<void> = new Subject<void>();
  public lastChangedFilter: appliedFilter;
  public sidebarContent: string;
  private dynamicContent$ = new Subject<void>();

  constructor(
    public windowService: WindowService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private wpApiService: WordpressApiService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.initWindowWidth(() => {
      if (!this.isMobile) {
        this.dialog.closeAll();
      }
      this.cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      if (!this.isMobile) {
        this.dialog.closeAll();
      }
      this.cdRef.markForCheck();
    });

    this.route.queryParams.subscribe((params) => {
      if ('bySuggestions' in params && params.bySuggestions !== '') {
        this.queryFromRoute = params.bySuggestions;
        const list = params.bySuggestions.split(',');
        this.setSearchMode(list.length > 1? 'searchByGenesList' : 'searchByGenes');
        this.setSearchQuery(params.bySuggestions);
        this.confirmedQuery = params.bySuggestions;
        this.updateGenesList(true);
        this.cdRef.markForCheck();
      }
    });

    this.ngZone.runOutsideAngular(() => {
      this.wpApiService.getSectionContent('sidebar')
        .pipe(takeUntil(this.dynamicContent$))
        .subscribe((content) => {
          this.sidebarContent = content;
        }, error => {
          console.warn(error);
        });
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  /**
   * View
   */

  public updateViewOnSkeletonChange(event: boolean, name: 'articles' | 'pubmed' | 'latest'): void {
    if (name === 'articles') {
      this.showArticlesSkeleton = event;
    }

    if (name === 'pubmed') {
      this.showPubmedFeedSkeleton = event;
    }

    if (name === 'latest') {
      this.showLatestGenesSkeleton = event;
    }
  }

  public updateOnFilterChange($event: appliedFilter) {
    this.lastChangedFilter = $event;
  }

  public setLoader(event: boolean) {
    this.genesListIsLoading = event;
  }

  /**
   * Search
   */

  public updateGenesList(isSubmit?: boolean): void {
    if (isSubmit) {
      this.confirmedQuery = this.searchedQuery;
    } else {
      this.confirmedQuery = null;
    }
  }

  public setSearchQuery(query: string): void {
    this.queryLength = query?.length ? query.split(',').length : 0;
    this.searchedQuery = query;

    if (this.queryLength > 1) {
      const filteredQueryArray = query
        .split(',')
        .filter(q => q)
        .map(q => q.trim());

      query = filteredQueryArray[filteredQueryArray.length - 1];
    }

    this.getHints(query);
  }

  public setSearchMode(searchMode: SearchMode): void {
    this.searchMode = searchMode;
    this.confirmedQuery = null;
  }

  private getHints(query: string): void {
    if (query && query.length > 1) {
      this.showProgressBar = true;
      this.apiService
        .getGenesMatchByString(query, undefined)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (searchData) => {
            this.geneHints = searchData.items; // If nothing found, will return empty array
            this.showProgressBar = false;
          },
          (error) => {
            console.warn(error);
            this.showProgressBar = false;
          }
        );
    } else {
      this.geneHints = [];
    }
  }

  /**
   * Wizard
   */

  public openWizard() {
    this.wizardService.open();
  }

  private loadWizard() {
    this.wizardService.openOnce();
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
