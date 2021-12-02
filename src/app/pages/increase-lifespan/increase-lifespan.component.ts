import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';
import { GenesWLifespanResearches } from '../../core/models/open-genes-api/genes-with-increase-lifespan-researches.model';
import { SearchMode } from '../../core/models/settings.model';

@Component({
  selector: 'app-lifespan-research-page',
  templateUrl: './increase-lifespan.component.html',
  styleUrls: ['./increase-lifespan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncreaseLifespanComponent extends WindowWidth implements OnInit, OnDestroy {
  public genes: GenesWLifespanResearches[];
  public lastGenes: GenesWLifespanResearches[];
  public searchedGenes: GenesWLifespanResearches[];
  public confirmedGenesList: GenesWLifespanResearches[];
  public isAvailable = true;
  public genesListIsLoaded = false;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGenes';

  constructor(
    public windowService: WindowService,
    private filterService: FilterService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.getGenes();
    this.initWindowWidth(() => {
      this.cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public getGenes(): void {
    this.apiService
      .getGenesWLifespanResearches()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (genes) => {
          this.genes = genes;
          this.confirmedGenesList = genes;
          this.cdRef.markForCheck();
        },
        (err) => {
          this.isAvailable = false;
          this.errorStatus = err.statusText;
          this.cdRef.markForCheck()
        }
      );
  }

  public setIsGenesListLoaded(event: boolean): void {
    this.genesListIsLoaded = event;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public setSearchQuery(query: string): void {
    this.searchByGenes(query);
  }

  public updateGenesList(query): void {
    if (query && this.searchedGenes.length) {
      this.confirmedGenesList = [...this.searchedGenes];
    }

    if (query && this.searchedGenes.length === 0) {
      this.confirmedGenesList = [];
    }

    if (!query && this.searchedGenes.length === 0) {
      this.confirmedGenesList = this.genes;
    }
  }

  private searchByGenes(query: string): void {
    if (query && query.length > 2) {
      this.searchedGenes = this.genes?.filter((gene) => {
        // Fields always acquired in response
        const searchedText = [gene.id, gene?.ensembl ? gene.ensembl : '', gene.symbol, gene.name]
          .join(' ')
          .toLowerCase();
        return searchedText.includes(query);
      });
    } else {
      this.searchedGenes = [];
    }
  }
}
