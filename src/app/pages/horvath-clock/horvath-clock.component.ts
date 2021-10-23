import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';
import { SearchMode } from '../../core/models/settings.model';
import { GenesInHorvathClock } from '../../core/models/openGenesApi/genes-in-horvath-clock.model';

@Component({
  selector: 'app-horvath-clock-page',
  templateUrl: './horvath-clock.component.html',
  styleUrls: ['./horvath-clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorvathClockComponent extends WindowWidth implements OnInit, OnDestroy {
  public genes: GenesInHorvathClock[];
  public lastGenes: GenesInHorvathClock[];
  public isAvailable = true;
  public genesListIsLoaded = false;
  public errorStatus: string;
  public searchMode: SearchMode = 'searchByGenes';
  public searchQuery: string;
  public notFoundAndFoundGenes: any;
  public curatedGeneSymbolsArray: string[] = [];

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
      .getGenes()
      .pipe(takeUntil(this.subscription$))
      .subscribe((genes) => {
        genes.forEach((gene) => {
          this.curatedGeneSymbolsArray.push(gene.symbol);
        });
      });

    this.apiService
      .getGenesInHorvathClock()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (genes) => {
          this.genes = genes;
          this.cdRef.markForCheck();
        },
        (err) => {
          this.isAvailable = false;
          this.errorStatus = err.statusText;
        }
      );
  }

  public setIsGenesListLoaded(event: boolean): void {
    this.genesListIsLoaded = event;
    console.log(this.genesListIsLoaded);
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  public setNotFoundAndFoundGenes(event: any): void {
    this.notFoundAndFoundGenes = event;
  }
}
