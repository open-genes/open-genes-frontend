import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Genes } from '../../core/models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { WindowService } from '../../core/services/browser/window.service';
import { WizardSheetComponent } from '../../components/wizard-sheet/wizard-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private bottomSheetRef: any;
  @Output()
  dataSourceUpdate: EventEmitter<Genes[]> = new EventEmitter<Genes[]>();

  @ViewChild(WizardSheetComponent) WizardSheetComponent: WizardSheetComponent;

  closeWizardSheet(): void {
    console.log('I listened to an event');
    if (!localStorage.getItem('showWizardSheet')) {
      localStorage.setItem('showWizardSheet', JSON.stringify(false));
    }
    this.bottomSheetRef.dismiss();
  }

  public genes: Genes[];
  public lastGenes: Genes[];
  public isAvailable = true;
  public errorStatus: string;
  public environment = environment;
  private subscription$ = new Subject();
  public isMobile: boolean;
  private resDesktop = 951.98;

  constructor(
    private bottomSheet: MatBottomSheet,
    private filterService: FilterService,
    private windowService: WindowService,
    private readonly apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getGenes();
    this.getLastEditedGenes();
    this.initWindowWidth();
    this.detectWindowWidth();
    this.openWizardSheet();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  /**
   * HTTP requests
   */
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
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }

  /**
   * Wizard Bottom Sheet
   */
  public openWizardSheet(): void {
    this.bottomSheetRef = this.bottomSheet.open(WizardSheetComponent, {
      data: {},
    });
  }

  /**
   * Responsiveness
   */
  private initWindowWidth(): void {
    this.windowService
      .setWindowWidth()
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.resDesktop;
        this.cdRef.markForCheck();
      });
  }

  private detectWindowWidth(): void {
    this.windowService.windowWidth$
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.resDesktop;
        this.cdRef.markForCheck();
      });
  }
}
