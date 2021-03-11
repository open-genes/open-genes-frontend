import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  OnInit, EventEmitter,
} from "@angular/core";
import { ApiService } from "../../../../../../core/services/api/open-genes.api.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { SelectionCriteria } from "../../../../../../core/models/selection-criteria.model";
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-research-chart',
  templateUrl: './research-chart.component.html',
  styleUrls: ['./research-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchChartComponent implements OnInit {
  @Input() hgnc: string;
  @Output() criateriaChosen: EventEmitter<string> = new EventEmitter();
  public commentCauseStats: SelectionCriteria;
  private subscription$ = new Subject();

  constructor(
    private apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
    private filterService: FilterService,
  ) {
  }

  ngOnInit(): void {
    this.getCommentCause();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private getCommentCause(): void {
    this.apiService.getGeneByHGNCsymbol(this.hgnc)
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (gene) => {
          gene?.['commentCause'] ? this.commentCauseStats =
              gene?.['commentCause'] : this.commentCauseStats = { 1: ""};

          this.cdRef.markForCheck();
        });
  }

  public filterBySelectionCriteria(criteria: string): void {
    this.criateriaChosen.emit(criteria);
  }
}
