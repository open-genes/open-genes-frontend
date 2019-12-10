import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {IGene} from '../../core/models';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  genes: IGene[];
  lastGenes: IGene[];
  newsGene: IGene;

  private expressionTranslates = { // TODO: убрать хардкод
    уменьшается: 'decreased',
    увеличивается: 'increased',
    неоднозначно: 'mixed'
  };

  constructor(private apiService: ApiService, private translate: TranslateService) {
  }

  ngOnInit() {
    this.getGenes();
    this.getLastgenes();
  }

  private getGenes() {
    this.apiService.getGenes().subscribe((genes) => {
      this.genes = genes;
      this.newsGene = genes[Math.floor(Math.random() * genes.length)];
    });
  }

  private getLastgenes() {
    this.apiService.getLastGene().subscribe((genes) => {
      this.lastGenes = genes;
    });
  }

  private filterByFuncClusters(fc: number[]) {
    if (fc.length > 0) {
      this.apiService.getGenesByFunctionalClusters(fc).subscribe((genes) => {
        this.genes = genes;
      });
    } else {
      this.getGenes();
    }
  }

  private filterByExpressionChange(expression: string) {
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
}
