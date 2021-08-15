import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { Genes } from '../../core/models';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
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
  public environment = environment;
  private subscription$ = new Subject();
  public isMobile: boolean;
  private resDesktop = 951.98;

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef,
    private windowService: WindowService
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
