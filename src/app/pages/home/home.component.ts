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

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  @Output() dataSourceUpdate: EventEmitter<Genes[]> = new EventEmitter<
    Genes[]
  >();

  public genes: Genes[];
  public lastGenes: Genes[];
  public error: number;
  private ngUnsubscribe = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getGenes();
    this.getLastEditedGenes();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getGenes(): void {
    this.apiService.getGenes().subscribe(
      (genes) => {
        this.genes = genes;
        this.cdRef.markForCheck();
      },
      (err) => {
        this.error = err;
      }
    );
  }

  public getLastEditedGenes(): void {
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }
}
