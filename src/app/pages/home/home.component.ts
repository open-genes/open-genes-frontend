import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Genes } from '../../core/models';
import { takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';
import { SearchMode, SearchModeEnum } from '../../core/models/settings.model';
import { SearchModel } from '../../core/models/open-genes-api/search.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends WindowWidth implements OnInit, OnDestroy {
  public searchedGenes: Pick<Genes, 'id' | 'name' | 'symbol' | 'aliases' | 'ensembl'>[] | Genes[] = [];
  public confirmedGenesList: Genes[];
  public confirmedGenesIds: number[];
  public foundAndNotFoundGenes: Omit<SearchModel, 'items'>;
  public foundGenes: Omit<SearchModel, 'items'>;
  public genesLength: number;
  public errorStatus: string;
  public searchMode: SearchMode;
  public searchModeEnum = SearchModeEnum;

  public genesListIsLoading = true;
  public showLatestGenesSkeleton = true;
  public showArticlesSkeleton = true;
  public showPubmedFeedSkeleton = true;
  public showProgressBar = false;
  public queryLength: number;


  constructor(
    public windowService: WindowService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
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

  public setSearchQuery(query: string): void {
    if (this.searchMode === this.searchModeEnum.searchByGoTerms) {
      this.searchGenesByGoTerm(query);
    } else {
      this.queryLength = query.split(',').length;
      this.searchGenes(query);
    }
  }

  public updateGenesList(query): void {
    if (query) {
      if (this.searchMode === this.searchModeEnum.searchByGoTerms) {
        this.confirmedGenesList = this.searchedGenes as Genes[];
      } else {
        this.confirmedGenesIds = this.searchedGenes.map((gene) => gene.id);
        this.foundAndNotFoundGenes = this.foundGenes;
      }
    } else {
      this.confirmedGenesIds = null;
      this.confirmedGenesList = null;
    }

    this.cdRef.markForCheck();
  }

  public setSearchMode(searchMode: SearchMode): void {
    this.searchMode = searchMode;
    this.confirmedGenesIds = null;
    this.confirmedGenesList = null;
    this.foundAndNotFoundGenes = {
      found: [],
      notFound: [],
    };
  }

  public updateViewOnSkeletonChange(event: boolean, name: 'articles' | 'news' | 'latest'): void {
    if (name === 'articles') {
      this.showArticlesSkeleton = event;
    }

    if (name === 'news') {
      this.showPubmedFeedSkeleton = event;
    }

    if (name === 'latest') {
      this.showLatestGenesSkeleton = event;
    }

    this.cdRef.detectChanges();
  }

  public setLoader(event: boolean) {
    this.genesListIsLoading = event;
    this.cdRef.markForCheck();
  }

  /**
   * Wizard
   */
  public openWizard() {
    this.wizardService.open();
  }

  private searchGenes(query: string): void {
    if (query && query.length > 2) {
      this.showProgressBar = true;
      this.apiService
        .getGenesMatchByString(query, this.queryLength > 1 ? 'byGeneSmb' : undefined)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (searchData) => {
            this.searchedGenes = searchData.items; // If nothing found, will return empty array
            this.foundGenes = {
              found: this.queryLength > 1 ? searchData.found : [],
              notFound: this.queryLength > 1 ? searchData.notFound : [],
            };
            this.showProgressBar = false;
            this.cdRef.markForCheck();
          },
          (error) => {
            console.log(error);
            this.showProgressBar = false;
            this.cdRef.markForCheck();
          }
        );
    } else {
      this.searchedGenes = [];
      this.foundAndNotFoundGenes = {
        found: [],
        notFound: [],
      };
    }
  }

  private searchGenesByGoTerm(query: string): void {
    if (query && query.length > 2) {
      this.showProgressBar = true;
      this.apiService
        .getGoTermMatchByString(query)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (genes) => {
            this.searchedGenes = genes; // If nothing found, will return empty array
            this.mapTerms();
            this.showProgressBar = false;
            this.cdRef.markForCheck();
          },
          (error) => {
            console.log(error);
            this.showProgressBar = false;
            this.cdRef.markForCheck();
          }
        );
    } else {
      this.searchedGenes = [];
    }
  }

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

  private loadWizard() {
    this.wizardService.openOnce();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }


}
