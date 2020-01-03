import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';

import {ApiService} from '../../core/services/api.service';
import {Genes, IFilter} from '../../core/models';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  genes: Genes[];
  lastGenes: Genes[];
  filters: IFilter;
  error: number;

  private expressionTranslates = { // TODO: убрать хардкод
    уменьшается: 'decreased',
    увеличивается: 'increased',
    неоднозначно: 'mixed'
  };

  constructor(
    private readonly apiService: ApiService,
    private readonly translate: TranslateService
  ) {
    this.filters = {
      name: false,
      ageMya: false,
      cluster: [],
      expression: null
    };
  }

  ngOnInit() {
    this.getGenes();
    this.getLastEditedGenes();
  }

  private getGenes() {
    this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
    }, error => this.error = error);
  }

  private getLastEditedGenes() {
    this.apiService.getLastEditedGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }

  public filterByFuncClusters(fc: number[]) {
    if (fc.length > 0) {
      this.apiService.getGenesByFunctionalClusters(fc).subscribe((genes) => {
        this.genes = genes;
      });
    } else {
      this.getGenes();
    }
  }

  public filterByExpressionChange(expression: string) {
    if (expression) {
      if (this.translate.currentLang === 'ru') {
        expression = this.expressionTranslates[expression];
      }
      this.apiService.getGenesByExpressionChange(expression).subscribe(genes => {
        this.genes = genes;
      });
    } else {
      this.getGenes();
    }
  }

  /**
   * Сброс фильтров таблицы генов
   */
  public filtersCleared() {
    this.getGenes();
  }
}
