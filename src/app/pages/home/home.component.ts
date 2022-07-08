import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Genes } from '../../core/models';
import { takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';
import { SearchMode, SearchModeEnum } from '../../core/models/settings.model';
import { GeneFieldsModalComponent } from '../../components/shared/gene-fields-modal/gene-fields-modal.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends WindowWidth implements OnInit, OnDestroy {
  @ViewChild(GeneFieldsModalComponent) filterPanel!: GeneFieldsModalComponent;

  public searchedGenes: Pick<Genes, 'id' | 'name' | 'symbol' | 'aliases' | 'ensembl'>[] | Genes[] = [];
  public confirmedGenesList: Genes[];
  public confirmed = false;
  public confirmedQuery: string;
  public searchedQuery: string;
  public genesLength: number;
  public errorStatus: string;
  public searchMode: SearchMode;
  public searchModeEnum = SearchModeEnum;

  public genesListIsLoading = true;
  public showLatestGenesSkeleton = true;
  public showArticlesSkeleton = true;
  public showPubmedFeedSkeleton = true;
  public showFiltersSkeleton = true;
  public showProgressBar = false;
  public queryLength: number;

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

  public updateGenesList(query: boolean): void {
    if (query) {
      this.confirmed = true;
    } else {
      this.confirmed = false;
      this.confirmedQuery = null;
      this.confirmedGenesList = null;
    }
  }

  public setSearchQuery(query: string): void {
    if (this.searchMode === this.searchModeEnum.searchByGoTerms) {
      this.searchGenesByGoTerm(query);
    } else {
      this.queryLength = query.split(',').length;
      this.searchedQuery = query;

      if (this.queryLength > 1) {
        query = query
          .split(',')
          .filter((q) => q)
          .map((q) => q.trim())
          .toString();
      }

      this.searchGenes(query);
    }
  }

  public setSearchMode(searchMode: SearchMode): void {
    this.searchMode = searchMode;
    this.confirmedQuery = null;
    this.confirmedGenesList = null;
  }

  private searchGenes(query: string): void {
    if (query && query.length > 1) {
      this.showProgressBar = true;
      this.apiService
        .getGenesMatchByString(query, this.queryLength > 1 ? 'byGeneSymbol' : undefined)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (searchData) => {
            this.searchedGenes = searchData.items; // If nothing found, will return empty array
            this.showProgressBar = false;
            if (this.confirmed) {
              this.setGenesList();
            }
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
            if (this.confirmed) {
              this.setGenesList();
            }
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

  setGenesList() {
    if (this.searchMode === this.searchModeEnum.searchByGoTerms) {
      this.confirmedGenesList = this.searchedGenes as Genes[];
    } else {
      this.confirmedQuery = this.searchedQuery;
    }
    this.confirmed = false;
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
