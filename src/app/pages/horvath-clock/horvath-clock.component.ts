import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';
import { SearchMode } from '../../core/models/settings.model';
import { GenesInHorvathClock } from '../../core/models/open-genes-api/genes-in-horvath-clock.model';

@Component({
  selector: 'app-horvath-clock-page',
  templateUrl: './horvath-clock.component.html',
  styleUrls: ['./horvath-clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorvathClockComponent extends WindowWidth implements OnInit, OnDestroy {
  public genes: GenesInHorvathClock[];
  public lastGenes: GenesInHorvathClock[];
  public searchedGenes: GenesInHorvathClock[];
  public confirmedGenesList: GenesInHorvathClock[];
  public isAvailable = true;
  public genesListIsLoaded = false;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGenes';
  public curatedGeneSymbolsArray: string[] = [];

  constructor(
    public windowService: WindowService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    super(windowService);
  }

  // Please be kind to me. I did it only because we had very little time until a presentation day

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
    this.apiService.getGenesV2()
      .pipe(
        takeUntil(this.subscription$),
        switchMap((filteredGenes) => {
          filteredGenes.items.forEach((gene) => {
            this.curatedGeneSymbolsArray.push(gene.symbol);
          });
          return this.apiService.getGenesInHorvathClock();
        })
      )
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
