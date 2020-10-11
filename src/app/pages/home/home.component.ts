import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {Genes} from '../../core/models';
import {FilterService} from '../../components/shared/genes-list/services/filter.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
  genes: Genes[];
  lastGenes: Genes[];
  error: number;

  private ngUnsubscribe = new Subject();

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getGenes();
    this.getLastEditedGenes();
    this.updateGenesByFuncClusters();
    this.updateGenesByExpressionChange();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getGenes() {
    this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
      this.cdRef.markForCheck();
    }, error => this.error = error);
  }

  public getLastEditedGenes() {
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }

  public updateGenesByFuncClusters() {
    console.log('updateGenesByFuncClusters called');
    this.filterService.getByFuncClusters().subscribe((list) => {
      console.log('getByFuncClusters subscribed');
      console.log(list);

      if (list.length !== 0) {
        console.log('getByFuncClusters list.length !== 0');
        this.apiService.getGenesByFunctionalClusters(list).subscribe((genes) => {
          this.genes = genes;
          this.cdRef.markForCheck();
          console.log('getByFuncClusters markForCheck');
        }, error => this.errorLogger(this, error));
      } else {
        this.getGenes();
      }
    }, error => this.errorLogger(this, error));
  }

  public updateGenesByExpressionChange() {
    console.log('updateGenesByExpressionChange called');
    this.filterService.getByExpressionChange().subscribe((expression) => {
      console.log('getByExpressionChange subscribed');
      console.log(expression);

      if (expression) {
        console.log('getByFuncClusters expression !== null');
        this.apiService.getGenesByExpressionChange(expression).subscribe(genes => {
          this.genes = genes;
          this.cdRef.markForCheck();
          console.log('getByExpressionChange markForCheck');
        }, error => this.errorLogger(this, error));
      } else {
        this.getGenes();
      }
    }, error => this.errorLogger(this, error));
  }

  private errorLogger(context: any, error: any) {
    console.warn(error);
  }
}
