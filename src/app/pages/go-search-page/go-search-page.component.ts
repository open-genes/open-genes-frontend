import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Genes } from '../../core/models';
import { SearchMode, SearchModeEnum } from '../../core/models/settings.model';
import { WindowService } from '../../core/services/browser/window.service';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { takeUntil } from 'rxjs/operators';
import { WindowWidth } from '../../core/utils/window-width';

@Component({
  selector: 'app-go-search-page',
  templateUrl: './go-search-page.component.html',
  styleUrls: ['./go-search-page.component.scss'],
})
export class GoSearchPageComponent extends WindowWidth implements OnInit, OnDestroy {
  public searchedGenes: Pick<Genes, 'id' | 'name' | 'symbol' | 'aliases' | 'ensembl'>[] | Genes[] = [];
  public confirmedGenesList: Genes[];
  public confirmedQuery: string;
  public searchedQuery: string;
  public itemsQuantity: number;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGoTerms';
  public searchModeEnum = SearchModeEnum;

  public genesListIsLoading = true;
  public showLatestGenesSkeleton = true;
  public showArticlesSkeleton = true;
  public showPubmedFeedSkeleton = true;
  public showFiltersSkeleton = true;
  public showProgressBar = false;
  public queryLength: number;
  public placeholder: string;

  constructor(
    public windowService: WindowService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.initWindowWidth(() => {
      this.cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      this.cdRef.markForCheck();
    });

    this.loadWizard();
  }

  /**
   * View
   */

  public updateViewOnSkeletonChange(event: boolean, name: 'articles' | 'pubmed' | 'latest' | 'filters'): void {
    if (name === 'articles') {
      this.showArticlesSkeleton = event;
    }

    if (name === 'pubmed') {
      this.showPubmedFeedSkeleton = event;
    }

    if (name === 'latest') {
      this.showLatestGenesSkeleton = event;
    }

    if (name === 'filters') {
      this.showFiltersSkeleton = event;
    }
  }

  public setLoader(event: boolean) {
    this.genesListIsLoading = event;
  }

  /**
   * Search
   */

  public updateGenesList(query): void {
    if (query) {
      this.confirmedGenesList = this.searchedGenes as Genes[];
    } else {
      this.confirmedQuery = null;
      this.confirmedGenesList = null;
    }
  }

  public setSearchQuery(query: string): void {
    this.searchGenesByGoTerm(query);
  }

  public setSearchMode(searchMode: SearchMode): void {
    this.searchMode = searchMode;
    this.confirmedQuery = null;
    this.confirmedGenesList = null;
  }
  private searchGenesByGoTerm(query: string): void {
    if (query && query.length > 1) {
      this.showProgressBar = true;
      this.apiService
        .getGoTermMatchByString(query)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (genes) => {
            this.searchedGenes = genes; // If nothing found, will return empty array
            this.mapTerms();
            this.showProgressBar = false;
          },
          (error) => {
            console.warn(error);
            this.showProgressBar = false;
          }
        );
    } else {
      this.searchedGenes = [];
    }
  }

  /**
   * Map data
   */

  private mapTerms(): void {
    this.searchedGenes.forEach((gene: Genes) => {
      if (gene.terms) {
        Object.keys(gene.terms).forEach((key) => [
          gene.terms[key].map((term) => {
            return (gene.terms[key] = this.toMap(term));
          }),
        ]);
      }
    });
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

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
