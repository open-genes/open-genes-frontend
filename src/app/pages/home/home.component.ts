import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { ApiService } from "../../core/services/api/open-genes.api.service";
import { Genes } from "../../core/models";
import { FilterService } from "../../components/shared/genes-list/services/filter.service";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { MockApiService } from '../../core/services/api/mock.api.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  @Output() dataSourceUpdate: EventEmitter<Genes[]> = new EventEmitter<Genes[]>();

  public genes: Genes[];
  public lastGenes: Genes[];
  public isAvailable: boolean = true;
  public errorStatus: string;
  private subscription$ = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef,
    private mockApiService: MockApiService,
  ) {}

  ngOnInit(): void {
    this.getGenes();
    this.getLastEditedGenes();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public getGenes(): void {
    this.apiService.getGenes()
      .pipe(takeUntil(this.subscription$))
      .subscribe(
      (genes) => {
        this.genes = genes;
        this.cdRef.markForCheck();
      },
      (err) => {
        // this.isAvailable = false;
        // this.errorStatus = err.statusText;

        this.mockApiService.getMockResponse()
        .pipe(takeUntil(this.subscription$))
            .subscribe(
              (genes) => {
                this.genes = genes;
                this.cdRef.markForCheck();
        });
      }
    );
  }

  public getLastEditedGenes(): void {
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }
}
