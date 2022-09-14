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
  public results: any[];
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
  public query: string;

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

  public setLoader(event: boolean) {
    this.genesListIsLoading = event;
  }

  /**
   * Search
   */

  public updateGenesList(event: boolean): void {
    if (event) {
      this.searchGenesByGoTerm(this.query);
    } else {
      this.query = null;
      this.results = null;
    }
  }

  public setSearchQuery(query: string): void {
    if (query && query.length > 1) {
      this.query = query.toLocaleLowerCase().trim();
    }
  }

  public searchGenesByGoTerm(query: string): void {
    if (query && query.length > 1) {
      this.showProgressBar = true;
      this.apiService
        .getGoTermMatchByString(query)
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (res) => {
            const genes = [...res.items];
            genes.forEach((gene: Genes) => {
              if (gene.terms) {
                Object.keys(gene.terms).forEach((key) => [
                  gene.terms[key].map((term) => {
                    return (gene.terms[key] = this.toMap(term));
                  }),
                ]);
              }
            });
            this.results = genes;
              this.showProgressBar = false;
          },
          (error) => {
            console.warn(error);
            this.showProgressBar = false;
          }
        );
    } else {
      this.results = [];
    }
  }


  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
