import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Genes } from '../../core/models';
import { takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';
import { SearchMode, SearchModeEnum } from '../../core/models/settings.model';
import { SessionStorageService } from '../../core/services/session-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends WindowWidth implements OnInit, OnDestroy {
  public genes: Genes[];
  public searchedGenes: Genes[] = [];
  public confirmedGenesList: Genes[] | string;
  public isAvailable = true;
  public errorStatus: string;
  public searchMode: SearchMode;
  public searchModeEnum = SearchModeEnum;
  public notFoundAndFoundGenes: any;
  public confirmedFoundGenes: any;
  public showLatestGenesSkeleton = true;
  public showArticlesSkeleton = true;
  public showPubmedFeedSkeleton = true;
  public showProgressBar = false;
  public genesListIsLoading = true;
  public queryLength: number;

  constructor(
    public windowService: WindowService,
    private sessionStorageService: SessionStorageService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.genesListIsLoading = true;
    this.getGenes();

    this.initWindowWidth(() => {
      this.cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      this.cdRef.markForCheck();
    });

    this.loadWizard();
  }

  public getGenes(): void {
    this.apiService
      .getGenesV2()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (filteredGenes) => {
          this.genes = filteredGenes.items;
          // Make the genes property immutable after we set a value
          Object.defineProperty(this.genes, 'genes', { writable: false });
          this.cdRef.markForCheck();
        },
        (err) => {
          this.isAvailable = false;
          this.errorStatus = err.statusText;
          this.cdRef.markForCheck();
        }
      );
  }

  public setSearchQuery(query: string): void {
    this.queryLength = query.split(',').length;
    if (this.queryLength === 1) {
      if (this.searchMode === this.searchModeEnum.searchByGenes) {
        this.searchByGenes(query);
      }

      if (this.searchMode === this.searchModeEnum.searchByGoTerms) {
        this.searchGenesByGoTerm(query);
      }

      this.notFoundAndFoundGenes = {
        foundGenes: [],
        notFoundGenes: [],
      };
    } else {
      if (this.searchMode !== this.searchModeEnum.searchByGoTerms) {
        this.searchByGenesList(query);
      }
    }
  }

  public updateGenesList(query): void {
    if (query && this.searchedGenes.length) {
      this.confirmedGenesList = [...this.searchedGenes];
    }

    if (query && this.searchedGenes.length === 0) {
      this.confirmedGenesList = [null];
    }

    if (!query && this.searchedGenes.length === 0) {
      this.confirmedGenesList = [];
    }

    this.confirmedFoundGenes = this.notFoundAndFoundGenes;
  }

  public setSearchMode(searchMode: SearchMode): void {
    this.searchMode = searchMode;
    this.confirmedGenesList = '';
    this.confirmedFoundGenes = {
      foundGenes: [],
      notFoundGenes: [],
    };
  }

  private searchByGenes(query: string): void {
    if (query && query.length > 2) {
      this.searchedGenes = this.genes?.filter((gene) => {
        // Fields always acquired in response
        const searchedText = [
          gene.id,
          gene?.ensembl ? gene.ensembl : '',
          gene.symbol,
          gene.name,
          gene?.aliases ? gene.aliases : '',
        ]
          .join(' ')
          .toLowerCase();
        return searchedText.includes(query);
      });
    } else {
      this.searchedGenes = [];
    }
  }

  private searchByGenesList(query: string): void {
    if (query) {
      this.searchedGenes = [];
      const notFoundGenes = [];
      let foundGenes = [];
      const arrayOfWords = query
        .split(',')
        .map((res) => res.trim())
        .filter((res) => res);

      const uniqWords = [...new Set(arrayOfWords)];

      if (uniqWords.length !== 0) {
        foundGenes = uniqWords.filter((symbol) => {
          const foundGene = this.genes.find((gene) => symbol === gene.symbol.toLowerCase());

          foundGene ? this.searchedGenes.push(foundGene) : notFoundGenes.push(symbol);

          return !!foundGene;
        });
      }

      this.notFoundAndFoundGenes = {
        foundGenes: foundGenes,
        notFoundGenes: notFoundGenes,
      };
    } else {
      this.searchedGenes = [];
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
    this.searchedGenes.forEach((gene) => {
      if (gene.terms) {
        Object.keys(gene.terms).forEach((key) => [
          gene.terms[key].map((term) => {
            return (gene.terms[key] = this.toMap(term));
          }),
        ]);
      }
    });
  }

  setLoader(event: boolean) {
    this.genesListIsLoading = event;
    this.cdRef.markForCheck();
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

  updateViewOnSkeletonChange(event: boolean, name: 'articles' | 'news' | 'latest'): void {
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
}
