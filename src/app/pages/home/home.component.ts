import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes.api.service';
import { Genes } from '../../core/models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MockApiService } from '../../core/services/api/mock.api.service';
import { WindowService } from '../../core/services/browser/window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  @Output() dataSourceUpdate: EventEmitter<Genes[]> = new EventEmitter<
    Genes[]
  >();

  public genes: Genes[];
  public lastGenes: Genes[];
  public isAvailable = true;
  public errorStatus: string;
  private subscription$ = new Subject();
  public isMobile: boolean;
  public isTablet: boolean;
  private resMobile = 959.98;
  private resPhablet = 767.98;

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef,
    private windowService: WindowService, // eslint-disable-line
    // private mockApiService: MockApiService
    ) {}

  ngOnInit(): void {
    this.getGenes();
    this.getLastEditedGenes();
    this.initWindowWidth();
    this.detectWindowWidth();
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

          /* Use this mock service to mock data when it's unavailable */
          /*
            this.mockApiService.getMockResponse()
            .pipe(takeUntil(this.subscription$))
                .subscribe(
                  (genes) => {
                    this.genes = genes;
                    this.cdRef.markForCheck();
            });
          */
        }
      );
  }

  public getLastEditedGenes(): void {
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
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
        this.isMobile = width <= this.resMobile;
        this.isTablet = width <= this.resPhablet;
        this.cdRef.markForCheck();
      });
  }

  private detectWindowWidth(): void {
    this.windowService.windowWidth$
      .pipe(takeUntil(this.subscription$))
      .subscribe((width) => {
        this.isMobile = width <= this.resMobile;
        this.isTablet = width <= this.resPhablet;
        this.cdRef.markForCheck();
      });
  }
}
