import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {Genes, Filter} from '../../core/models';
import {FilterService} from '../../components/shared/genes-list/services/filter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  genes: Genes[];
  lastGenes: Genes[];
  filters: Filter;
  error: number;

  constructor(
    private readonly apiService: ApiService,
    private filterService: FilterService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.getGenes();
    this.getLastEditedGenes();
    this.updateGenesByFuncClusters();
    this.updateGenesByExpressionChange();
  }

  private getGenes() {
    this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
      this.cdRef.markForCheck();
    }, error => this.error = error);
  }

  private getLastEditedGenes() {
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }

  // TODO: вот тут не обновляются данные при подписке
  private updateGenesByFuncClusters() {
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
        }, error => this.error = error);
      } else {
        this.getGenes();
      }
    }, error => this.error = error);
  }

  private updateGenesByExpressionChange() {
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
        }, error => this.error = error);
      } else {
        this.getGenes();
      }
    }, error => this.error = error);
  }
}
