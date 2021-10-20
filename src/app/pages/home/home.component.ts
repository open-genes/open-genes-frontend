import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Genes } from '../../core/models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { WizardService } from '../../components/shared/wizard/wizard-service.service';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends WindowWidth implements OnInit, OnDestroy {
  public genes: Genes[];
  public lastGenes: Genes[];
  public isAvailable = true;
  public genesListIsLoaded = false;
  public errorStatus: string;
  public dataFromSearchBar = {
    isGoTermsMode: false,
    searchQuery: '',
  }

  constructor(
    public windowService: WindowService,
    private filterService: FilterService,
    private wizardService: WizardService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.getGenes();

    this.getLastEditedGenes();

    this.initWindowWidth(() => {
      this.cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      this.cdRef.markForCheck();
    });

    this.loadWizard();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public getGenes(): void {
    this.apiService
      .getGenes()
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

  public getLastEditedGenes(): void {
    this.apiService
      .getLastEditedGene()
      .pipe(takeUntil(this.subscription$))
      .subscribe((genes) => {
        this.lastGenes = genes;
        this.cdRef.markForCheck();
      });
  }

  public setIsGenesListLoaded(event: boolean): void {
    this.genesListIsLoaded = event;
    this.cdRef.markForCheck();
  }

  public setSearchQuery(event): void {
    this.dataFromSearchBar.searchQuery = event;
    this.dataFromSearchBar = { ...this.dataFromSearchBar};

  }

  public setSearchMode(event): void {
    this.dataFromSearchBar.isGoTermsMode = event;
    this.dataFromSearchBar = { ...this.dataFromSearchBar };
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
}
