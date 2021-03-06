import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api/open-genes.api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface ICommentCauseTypes {
  [n: number]: string
}

@Component({
  selector: 'app-research-chart',
  templateUrl: './research-chart.component.html',
  styleUrls: ['./research-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchChartComponent implements OnInit {
  @Input() hgnc: string;
  public commentCauseStats: ICommentCauseTypes;
  private subscription$ = new Subject();

  constructor(
    private apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
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
          gene?.['commentCause'] ? this.commentCauseStats = gene?.['commentCause'] : this.commentCauseStats = { 1: ""};

          this.cdRef.markForCheck();
        });
  }
}
